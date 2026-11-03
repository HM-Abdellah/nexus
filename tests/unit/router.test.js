import test from "node:test";
import assert from "node:assert/strict";
import { resolveRoute } from "../../src/app/router.js";

test("root and dashboard hashes resolve to dashboard", () => {
  assert.deepEqual(resolveRoute(""), { name: "dashboard" });
  assert.deepEqual(resolveRoute("#/"), { name: "dashboard" });
  assert.deepEqual(resolveRoute("#/dashboard"), { name: "dashboard" });
});

test("case library route resolves", () => {
  assert.deepEqual(resolveRoute("#/cases"), { name: "cases" });
});

test("case overview route returns a case identifier", () => {
  assert.deepEqual(resolveRoute("#/cases/CASE-001"), {
    name: "case-overview",
    caseId: "CASE-001"
  });
});

test("unsupported routes resolve to not-found", () => {
  assert.deepEqual(resolveRoute("#/unknown"), { name: "not-found" });
  assert.deepEqual(resolveRoute("#/cases/invalid%2Fpath"), { name: "not-found" });
});
