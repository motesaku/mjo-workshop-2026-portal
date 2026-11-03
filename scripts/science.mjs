import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { IMPORT_SCHEMA, scienceSeed } from "../src/science/contract.mjs";
import { validateImport } from "../src/science/validate.mjs";
import { prepareImport } from "../src/science/import-plan.mjs";

const [command, input, previous] = process.argv.slice(2);
const json = async (path) => JSON.parse(await readFile(path, "utf8"));
try {
  if (command === "generate") {
    // Refuse to overwrite generated artifacts; inspect changes before replacing them.
    await writeFile("schemas/scientific-import-v1.schema.json", JSON.stringify(IMPORT_SCHEMA, null, 2) + "\n", { flag: "wx" });
    await writeFile("seed/science-schema-v1.json", JSON.stringify(scienceSeed(), null, 2) + "\n", { flag: "wx" });
    console.log("Created versioned contract and schema-only EmDash seed.");
  } else if (command === "validate" || command === "fixture") {
    const result = validateImport(await json(input), { allowFixtures: command === "fixture" });
    if (!result.valid) throw new Error(result.errors.join("\n"));
    console.log(command === "fixture" ? "Valid test fixture. Import and publication forbidden." : "Valid reviewed export. No records imported or published.");
  } else if (command === "plan") {
    const plan = prepareImport(await json(input), previous ? await json(previous) : null);
    // Counts and hashes only: never echo private derivative text to a terminal log.
    console.log(JSON.stringify({ mode: plan.mode, bundle_sha256: plan.bundle_sha256, operations: plan.operations.map(({ operation, collection, external_id }) => ({ operation, collection, external_id })), omitted_record_count: plan.omitted_records.length }, null, 2));
  } else if (command === "check-generated") {
    for (const [path, expected] of [["schemas/scientific-import-v1.schema.json", IMPORT_SCHEMA], ["seed/science-schema-v1.json", scienceSeed()]]) {
      if (JSON.stringify(await json(resolve(path))) !== JSON.stringify(expected)) throw new Error(`${path}: generated artifact drift`);
    }
    console.log("Generated artifacts match the contract.");
  } else throw new Error("Usage: node scripts/science.mjs generate|check-generated|validate FILE|fixture FILE|plan FILE [PREVIOUS_EXPORT]");
} catch (error) { console.error(error.message); process.exitCode = 1; }
