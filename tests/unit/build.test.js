import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { buildSite } from "../../scripts/build.mjs";

test("static build includes app assets and excludes repository-only files", async () => {
  const outputDirectory = await buildSite();

  const publicFiles = [
    "index.html",
    "src/app/main.js",
    "src/core/hash.js",
    "src/domain/evidence.js",
    "src/data/evidence/case-001.js",
    "src/styles/app.css"
  ];

  for (const relativePath of publicFiles) {
    await access(path.join(outputDirectory, relativePath));
  }

  for (const privatePath of [
    "README.md",
    "package.json",
    "scripts/dev-server.mjs",
    "tests/unit/build.test.js",
    "docs/ARCHITECTURE.md"
  ]) {
    await assert.rejects(
      access(path.join(outputDirectory, privatePath)),
      { code: "ENOENT" }
    );
  }

  const html = await readFile(path.join(outputDirectory, "index.html"), "utf8");
  assert.match(html, /\.\/src\/styles\/app\.css/);
  assert.match(html, /\.\/src\/app\/main\.js/);
});
