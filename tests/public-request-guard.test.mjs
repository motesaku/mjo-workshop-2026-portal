import test from "node:test";
import assert from "node:assert/strict";
import {
	guardPublicRequest,
	isGuardedPath,
	jsonShapeViolation,
	PUBLIC_BODY_MAX_BYTES,
	PUBLIC_JSON_MAX_ARRAY_LENGTH,
	PUBLIC_JSON_MAX_DEPTH,
} from "../src/security/public-request-guard.mjs";

const ORIGIN = "http://127.0.0.1:4321";
const SIGNUP = `${ORIGIN}/_emdash/api/auth/signup/complete`;

function credentialBody(transports) {
	return JSON.stringify({
		token: "t",
		credential: {
			id: "a",
			rawId: "a",
			type: "public-key",
			response: { clientDataJSON: "a", attestationObject: "a", transports },
		},
	});
}

/** A ReadableStream that serves `bytes` in chunks and records whether it was read or cancelled. */
function chunkedStream(bytes, chunkSize = 4096) {
	const state = { pulls: 0, cancelled: false };
	let offset = 0;
	const stream = new ReadableStream({
		pull(controller) {
			state.pulls++;
			if (offset >= bytes.byteLength) return controller.close();
			controller.enqueue(bytes.slice(offset, offset + chunkSize));
			offset += chunkSize;
		},
		cancel() {
			state.cancelled = true;
		},
	});
	return { stream, state };
}

const post = (url, body, headers = {}) =>
	new Request(url, { method: "POST", body, headers: { "Content-Type": "application/json", ...headers }, duplex: "half" });

async function errorCode(response) {
	const json = await response.json();
	assert.equal(json.success, false);
	return json.error.code;
}

test("small valid body passes through byte-for-byte with method and headers", async () => {
	const body = credentialBody(["usb", "internal"]);
	const original = post(SIGNUP, body, { "X-EmDash-Request": "1", "CF-Connecting-IP": "203.0.113.9" });
	const guarded = await guardPublicRequest(original);
	assert.ok(guarded instanceof Request);
	assert.equal(guarded.method, "POST");
	assert.equal(guarded.url, SIGNUP);
	assert.equal(guarded.headers.get("x-emdash-request"), "1");
	assert.equal(guarded.headers.get("cf-connecting-ip"), "203.0.113.9");
	assert.equal(await guarded.text(), body);
});

test("declared Content-Length above the limit is rejected without reading the body", async () => {
	const stream = new ReadableStream({
		pull() {
			throw new Error("body must not be read");
		},
	});
	const request = post(SIGNUP, stream, { "Content-Length": String(PUBLIC_BODY_MAX_BYTES + 1) });
	const response = await guardPublicRequest(request);
	assert.ok(response instanceof Response);
	assert.equal(response.status, 413);
	assert.equal(await errorCode(response), "PAYLOAD_TOO_LARGE");
});

test("malformed Content-Length is rejected", async () => {
	const request = new Request(SIGNUP, { method: "POST", body: "{}", headers: { "Content-Length": "12abc" } });
	// Some runtimes normalise Content-Length; only assert when the header survived.
	if (request.headers.get("content-length") === "12abc") {
		const response = await guardPublicRequest(request);
		assert.equal(response.status, 413);
	}
});

test("chunked body above the limit is rejected and the stream is cancelled", async () => {
	const bytes = new TextEncoder().encode(credentialBody(Array(40000).fill("usb")));
	assert.ok(bytes.byteLength > PUBLIC_BODY_MAX_BYTES);
	const { stream, state } = chunkedStream(bytes);
	const response = await guardPublicRequest(post(SIGNUP, stream));
	assert.equal(response.status, 413);
	assert.equal(await errorCode(response), "PAYLOAD_TOO_LARGE");
	assert.ok(state.cancelled, "stream should be cancelled");
	assert.ok(state.pulls * 4096 < bytes.byteLength, "should stop reading early");
});

test("small chunked body passes", async () => {
	const body = credentialBody(["usb"]);
	const { stream } = chunkedStream(new TextEncoder().encode(body), 7);
	const guarded = await guardPublicRequest(post(SIGNUP, stream));
	assert.ok(guarded instanceof Request);
	assert.equal(await guarded.text(), body);
});

test("array longer than the limit is rejected (transports, redirect_uris)", async () => {
	const tooMany = Array(PUBLIC_JSON_MAX_ARRAY_LENGTH + 1).fill("usb");
	const r1 = await guardPublicRequest(post(SIGNUP, credentialBody(tooMany)));
	assert.equal(r1.status, 400);
	assert.equal(await errorCode(r1), "PAYLOAD_TOO_COMPLEX");

	const ok = await guardPublicRequest(post(SIGNUP, credentialBody(Array(PUBLIC_JSON_MAX_ARRAY_LENGTH).fill("usb"))));
	assert.ok(ok instanceof Request);

	const register = JSON.stringify({ redirect_uris: Array(100).fill("http://127.0.0.1/cb") });
	const r2 = await guardPublicRequest(post(`${ORIGIN}/_emdash/api/oauth/register`, register));
	assert.equal(r2.status, 400);
});

test("JSON is inspected regardless of Content-Type", async () => {
	const body = credentialBody(Array(1000).fill(0));
	const response = await guardPublicRequest(post(SIGNUP, body, { "Content-Type": "text/plain" }));
	assert.equal(response.status, 400);
});

test("deep nesting is rejected and hostile nesting does not throw", async () => {
	const deep = "[".repeat(PUBLIC_JSON_MAX_DEPTH + 1) + "]".repeat(PUBLIC_JSON_MAX_DEPTH + 1);
	const r1 = await guardPublicRequest(post(SIGNUP, deep));
	assert.equal(r1.status, 400);

	const atLimit = "[".repeat(PUBLIC_JSON_MAX_DEPTH) + "]".repeat(PUBLIC_JSON_MAX_DEPTH);
	assert.ok((await guardPublicRequest(post(SIGNUP, atLimit))) instanceof Request);

	const hostile = "[".repeat(30000) + "]".repeat(30000);
	const r2 = await guardPublicRequest(post(SIGNUP, hostile));
	assert.ok(r2 instanceof Response || r2 instanceof Request); // must not throw
	if (r2 instanceof Response) assert.equal(r2.status, 400);
});

test("invalid JSON and form bodies are forwarded unchanged", async () => {
	const broken = '{"token": "t", ';
	const g1 = await guardPublicRequest(post(SIGNUP, broken));
	assert.ok(g1 instanceof Request);
	assert.equal(await g1.text(), broken);

	const form = "grant_type=refresh_token&refresh_token=abc";
	const g2 = await guardPublicRequest(
		new Request(`${ORIGIN}/_emdash/api/oauth/token`, {
			method: "POST",
			body: form,
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
		}),
	);
	assert.ok(g2 instanceof Request);
	assert.equal(await g2.text(), form);
});

test("unguarded paths and bodyless methods return the original Request object", async () => {
	const big = "x".repeat(PUBLIC_BODY_MAX_BYTES * 3);
	const content = post(`${ORIGIN}/_emdash/api/content/posts`, big);
	assert.equal(await guardPublicRequest(content), content);

	const media = post(`${ORIGIN}/_emdash/api/media/upload-url`, big);
	assert.equal(await guardPublicRequest(media), media);

	const get = new Request(`${SIGNUP}?x=1`);
	assert.equal(await guardPublicRequest(get), get);

	const empty = new Request(SIGNUP, { method: "POST" });
	assert.equal(await guardPublicRequest(empty), empty);
});

test("path variants are still guarded", () => {
	for (const path of [
		"/_emdash/api/setup",
		"/_emdash/api/setup/admin-verify",
		"/_emdash/api/auth/invite/complete",
		"/_emdash/api/%61uth/signup/complete",
		"/_emdash/api/auth%2Fsignup%2Fcomplete",
		"/_EMDASH/API/AUTH/signup/complete",
		"/_emdash//api/auth/signup/complete",
		"/_emdash/api/content/%2e%2e/auth/signup/complete",
		"/_emdash/api/comments/posts/abc/reactions",
		"/_emdash/oauth/authorize",
		"/_emdash/api/oauth/device/code",
	]) {
		assert.ok(isGuardedPath(path), path);
	}
	for (const path of ["/_emdash/api/content/posts", "/_emdash/api/media/upload-url", "/about", "/_emdash/api/search"]) {
		assert.ok(!isGuardedPath(path), path);
	}
});

test("shape walker limits arrays and depth without recursion", () => {
	assert.equal(jsonShapeViolation({ a: [1, 2, 3] }), null);
	assert.equal(jsonShapeViolation({ a: Array(65).fill(0) }), "array");
	let nested = 0;
	for (let i = 0; i < 40; i++) nested = { n: nested };
	assert.equal(jsonShapeViolation(nested), "depth");
});
