import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PROJECT_ROOT = path.resolve(fileURLToPath(new URL("../", import.meta.url)));
const OUTPUT_DIR = path.join(PROJECT_ROOT, "dist");

const PUBLIC_DIRECTORIES = ["app", "core", "data", "domain", "styles"];

export async function buildSite() {
  await rm(OUTPUT_DIR, { recursive: true, force: true });
  await mkdir(path.join(OUTPUT_DIR, "src"), { recursive: true });

  await cp(
    path.join(PROJECT_ROOT, "index.html"),
    path.join(OUTPUT_DIR, "index.html")
  );

  for (const directory of PUBLIC_DIRECTORIES) {
    await cp(
      path.join(PROJECT_ROOT, "src", directory),
      path.join(OUTPUT_DIR, "src", directory),
      { recursive: true }
    );
  }

  return OUTPUT_DIR;
}

const isDirectExecution = process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectExecution) {
  const output = await buildSite();
  process.stdout.write(`NEXUS static site built at ${output}\n`);
}
