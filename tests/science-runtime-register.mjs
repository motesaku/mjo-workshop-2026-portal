import { registerHooks } from "node:module";
// Supply only Astro's virtual config module. All data operations and policy
// dispatch below use EmDash's real installed implementation and in-memory SQLite.
registerHooks({ resolve(specifier, context, nextResolve) {
  if (specifier === "virtual:emdash/config") return { url: "data:text/javascript,export default %7B%7D", shortCircuit: true };
  return nextResolve(specifier, context);
}, load(url, context, nextLoad) {
  const loaded = nextLoad(url, context);
  if (url.includes("/node_modules/emdash/") && loaded.format === "module" && loaded.source) {
    return { ...loaded, source: loaded.source.toString().replaceAll("import.meta.env", "({ DEV: false, PROD: true })") };
  }
  return loaded;
} });
