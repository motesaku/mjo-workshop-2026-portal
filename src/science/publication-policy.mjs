import { definePlugin } from "emdash";
import { COLLECTIONS } from "./contract.mjs";

export function scientificPublicationDecision(event) {
	if (Object.hasOwn(COLLECTIONS, event.collection)) {
		return {
			cancel: true,
			reason:
				"Scientific publication is disabled in Phase 3. A reviewed import and a separately verified publication workflow are required.",
		};
	}
}

// Host-local policy: shares the same collection IDs as the import validator.
// A user-editable review checkbox is deliberately not an authorization token.
// Package-style entrypoint (not fileURLToPath) so Cloudflare Workers can load it.
export const createPlugin = () =>
	definePlugin({
		id: "mjo-scientific-publication-policy",
		version: "1.0.0",
		capabilities: ["hooks.content-policy:register"],
		hooks: {
			"content:beforePublish": { errorPolicy: "abort", handler: scientificPublicationDecision },
			"content:beforeSchedule": { errorPolicy: "abort", handler: scientificPublicationDecision },
		},
	});

export default {
	id: "mjo-scientific-publication-policy",
	version: "1.0.0",
	format: "native",
	entrypoint: "mjo-workshop-2026-portal/scientific-publication-policy",
};
