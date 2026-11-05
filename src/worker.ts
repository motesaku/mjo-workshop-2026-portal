/// <reference types="@cloudflare/workers-types" />
// Official EmDash Worker entry: https://docs.emdashcms.com/deployment/cloudflare/#add-the-worker-entry-point
// Cron Trigger in wrangler.jsonc + scheduled handler (checked by `emdash doctor`).

import handler, { createScheduledHandler, PluginBridge } from "@emdash-cms/cloudflare/worker";
import { guardPublicRequest } from "./security/public-request-guard.mjs";

export { PluginBridge }; // Harmless without sandboxed plugins; keeps future options open.

export default {
	...handler,
	// Limit body size and JSON shape on EmDash's public API routes before EmDash parses them.
	// See src/security/public-request-guard.mjs.
	async fetch(request, env, ctx) {
		const guarded = await guardPublicRequest(request);
		if (guarded instanceof Response) return guarded;
		return handler.fetch!(guarded as typeof request, env, ctx);
	},
	scheduled: createScheduledHandler(),
} satisfies ExportedHandler;
