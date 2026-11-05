/// <reference types="@cloudflare/workers-types" />
// Official EmDash Worker entry: https://docs.emdashcms.com/deployment/cloudflare/#add-the-worker-entry-point
// Cron Trigger in wrangler.jsonc + scheduled handler (checked by `emdash doctor`).

import handler, { createScheduledHandler, PluginBridge } from "@emdash-cms/cloudflare/worker";

export { PluginBridge }; // Harmless without sandboxed plugins; keeps future options open.

export default {
	...handler,
	scheduled: createScheduledHandler(),
} satisfies ExportedHandler;
