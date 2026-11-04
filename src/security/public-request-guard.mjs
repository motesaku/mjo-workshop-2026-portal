// Site-level guard for request bodies sent to EmDash's unauthenticated API routes.
//
// Why: EmDash parses some public request bodies before any authentication or token
// check, and its 10 MB limit only applies when Content-Length is present. Unbounded
// arrays (for example `credential.response.transports` on signup/invite completion,
// or `redirect_uris` on OAuth client registration) make Zod create one issue per
// invalid element. Measured with Zod 4.6.7, a 1 MB body costs about 0.5 GB of heap,
// well above the 128 MB Workers memory limit.
//
// What: before Astro/EmDash see the request, bodies on the public route prefixes below
// are (1) limited to PUBLIC_BODY_MAX_BYTES, including chunked bodies, and (2) when they
// look like JSON, rejected if any array exceeds PUBLIC_JSON_MAX_ARRAY_LENGTH elements or
// nesting exceeds PUBLIC_JSON_MAX_DEPTH. Authenticated routes are never touched: EmDash
// rejects unauthenticated calls to them in middleware before reading a body.
//
// Uses only Web-standard APIs so it runs in workerd and in Node's test runner.

export const PUBLIC_BODY_MAX_BYTES = 64 * 1024;
export const PUBLIC_JSON_MAX_ARRAY_LENGTH = 64;
export const PUBLIC_JSON_MAX_DEPTH = 32;

/** Public EmDash routes that read a request body (see emdash/src/astro/middleware/auth.ts). */
export const GUARDED_PATH_PREFIXES = Object.freeze([
	"/_emdash/api/setup",
	"/_emdash/api/auth/",
	"/_emdash/api/oauth/",
	"/_emdash/oauth/",
	"/_emdash/api/comments/",
]);

const BODYLESS_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

/** Decode (repeatedly, bounded), unify slashes and case. Over-matching is safe; under-matching is not. */
function decodedLowerPath(pathname) {
	let path = pathname;
	for (let i = 0; i < 4; i++) {
		let decoded;
		try {
			decoded = decodeURIComponent(path);
		} catch {
			break;
		}
		if (decoded === path) break;
		path = decoded;
	}
	return path.replace(/\\/g, "/").replace(/\/{2,}/g, "/").toLowerCase();
}

function resolveDotSegments(path) {
	const out = [];
	for (const segment of path.split("/")) {
		if (segment === "..") out.pop();
		else if (segment !== ".") out.push(segment);
	}
	const joined = out.join("/");
	return joined.startsWith("/") ? joined : `/${joined}`;
}

function matchesPrefix(path) {
	return GUARDED_PATH_PREFIXES.some((prefix) => path.startsWith(prefix) || path === prefix.replace(/\/$/, ""));
}

/** True when a request to this pathname must pass the body guard. */
export function isGuardedPath(pathname) {
	const path = decodedLowerPath(pathname);
	return matchesPrefix(path) || matchesPrefix(resolveDotSegments(path));
}

function reject(status, code, message) {
	return new Response(JSON.stringify({ success: false, error: { code, message } }), {
		status,
		headers: { "Content-Type": "application/json", "Cache-Control": "private, no-store" },
	});
}

const tooLarge = () =>
	reject(413, "PAYLOAD_TOO_LARGE", `Request body exceeds ${PUBLIC_BODY_MAX_BYTES} bytes for this endpoint`);

/** Read at most `limit` bytes. Returns null (and cancels the stream) as soon as the limit is exceeded. */
async function readLimited(stream, limit) {
	const reader = stream.getReader();
	const chunks = [];
	let total = 0;
	for (;;) {
		const { done, value } = await reader.read();
		if (done) break;
		const chunk = value instanceof Uint8Array ? value : new Uint8Array(value);
		total += chunk.byteLength;
		if (total > limit) {
			await reader.cancel("request body too large").catch(() => {});
			return null;
		}
		chunks.push(chunk);
	}
	const bytes = new Uint8Array(total);
	let offset = 0;
	for (const chunk of chunks) {
		bytes.set(chunk, offset);
		offset += chunk.byteLength;
	}
	return bytes;
}

function looksLikeJson(bytes) {
	for (const byte of bytes) {
		// Skip whitespace and a UTF-8 byte order mark.
		if (byte === 0x20 || byte === 0x09 || byte === 0x0a || byte === 0x0d || byte === 0xef || byte === 0xbb || byte === 0xbf) continue;
		return byte === 0x7b || byte === 0x5b; // "{" or "["
	}
	return false;
}

/** Iterative walk: returns "array" | "depth" | null. Never recurses, so hostile nesting cannot overflow the stack. */
export function jsonShapeViolation(value, maxArrayLength = PUBLIC_JSON_MAX_ARRAY_LENGTH, maxDepth = PUBLIC_JSON_MAX_DEPTH) {
	const stack = [[value, 1]];
	while (stack.length > 0) {
		const [current, depth] = stack.pop();
		if (current === null || typeof current !== "object") continue;
		if (depth > maxDepth) return "depth";
		const children = Array.isArray(current) ? current : Object.values(current);
		if (Array.isArray(current) && current.length > maxArrayLength) return "array";
		for (const child of children) stack.push([child, depth + 1]);
	}
	return null;
}

/**
 * Inspect a request before it reaches EmDash.
 * Returns either a rejection Response or a Request to forward (the original object when untouched).
 * @param {Request} request
 * @returns {Promise<Request | Response>}
 */
export async function guardPublicRequest(request) {
	if (BODYLESS_METHODS.has(request.method) || request.body === null) return request;
	if (!isGuardedPath(new URL(request.url).pathname)) return request;

	const declared = request.headers.get("content-length");
	if (declared !== null && (!/^\d+$/.test(declared.trim()) || Number(declared) > PUBLIC_BODY_MAX_BYTES)) {
		return tooLarge();
	}

	let bytes;
	try {
		bytes = await readLimited(request.body, PUBLIC_BODY_MAX_BYTES);
	} catch {
		return reject(400, "INVALID_BODY", "Request body could not be read");
	}
	if (bytes === null) return tooLarge();

	if (looksLikeJson(bytes)) {
		let parsed;
		let parsedOk = false;
		try {
			parsed = JSON.parse(new TextDecoder().decode(bytes));
			parsedOk = true;
		} catch {
			// Not valid JSON: forward unchanged and let EmDash answer INVALID_JSON.
		}
		if (parsedOk) {
			const violation = jsonShapeViolation(parsed);
			if (violation === "array") {
				return reject(400, "PAYLOAD_TOO_COMPLEX", `JSON arrays are limited to ${PUBLIC_JSON_MAX_ARRAY_LENGTH} elements for this endpoint`);
			}
			if (violation === "depth") {
				return reject(400, "PAYLOAD_TOO_COMPLEX", `JSON nesting is limited to ${PUBLIC_JSON_MAX_DEPTH} levels for this endpoint`);
			}
		}
	}

	return new Request(request, { body: bytes });
}
