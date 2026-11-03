import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { resolveStaticFilePath } from "../../scripts/dev-server.mjs";

const root = path.resolve("/workspace/nexus");

test("root URL resolves to the application entry point", () => {
  assert.equal(resolveStaticFilePath("/", root), path.join(root, "index.html"));
});

test("normal paths remain inside the project root", () => {
  assert.equal(
    resolveStaticFilePath("/src/app/main.js", root),
    path.join(root, "src", "app", "main.js")
  );
});

test("parent-directory traversal is rejected", () => {
  assert.equal(resolveStaticFilePath("/../secrets.txt", root), null);
  assert.equal(resolveStaticFilePath("/%2e%2e/secrets.txt", root), null);
});

test("malformed URL encoding is rejected", () => {
  assert.equal(resolveStaticFilePath("/bad%ZZpath", root), null);
});
