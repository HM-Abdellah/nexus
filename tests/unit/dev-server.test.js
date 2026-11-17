import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { isPublicRelativePath, resolveStaticFilePath } from "../../scripts/dev-server.mjs";

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

test("malformed URL encoding and backslash paths are rejected", () => {
  assert.equal(resolveStaticFilePath("/bad%ZZpath", root), null);
  assert.equal(resolveStaticFilePath("/src\\app\\main.js", root), null);
});

test("private project files and folders are not public", () => {
  for (const requestPath of [
    "/README.md",
    "/package.json",
    "/scripts/dev-server.mjs",
    "/tests/unit/router.test.js",
    "/.devcontainer/devcontainer.json",
    "/.github/workflows/ci.yml",
    "/.git/config"
  ]) {
    assert.equal(resolveStaticFilePath(requestPath, root), null, requestPath);
  }
});

test("only approved source asset types are public", () => {
  assert.equal(isPublicRelativePath("src/app/main.js"), true);
  assert.equal(isPublicRelativePath("src/styles/app.css"), true);
  assert.equal(isPublicRelativePath("src/data/cases.json"), true);
  assert.equal(isPublicRelativePath("src/app/secrets.json"), false);
  assert.equal(isPublicRelativePath("src/styles/app.js"), false);
  assert.equal(isPublicRelativePath("public/assets/logo.svg"), true);
});
