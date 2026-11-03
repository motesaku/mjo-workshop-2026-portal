// Astro's font build helper calls listen(callback) without a host. Scope that
// temporary helper to loopback as well. Use via NODE_OPTIONS only for local work.
import { Server } from "node:net";
const originalListen = Server.prototype.listen;
Server.prototype.listen = function (...args) {
  if (typeof args[0] === "function" || args.length === 0) {
    args.unshift({ host: "127.0.0.1", port: 0 });
  } else if (typeof args[0] === "number" && typeof args[1] !== "string") {
    args.splice(1, 0, "127.0.0.1");
  } else if (args[0] && typeof args[0] === "object" && !args[0].path && !args[0].host) {
    args[0] = { ...args[0], host: "127.0.0.1" };
  }
  return originalListen.apply(this, args);
};
