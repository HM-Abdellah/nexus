import test from "node:test";
import assert from "node:assert/strict";
import { CASES, filterCases, findCaseById } from "../../src/data/cases.js";

test("case catalog exposes the known synthetic training case", () => {
  assert.equal(CASES.length, 1);
  assert.equal(findCaseById("CASE-001")?.title, "The Missing Account");
  assert.equal(findCaseById("UNKNOWN"), null);
});

test("filterCases returns every case for an empty query", () => {
  assert.deepEqual(filterCases(CASES), [...CASES]);
  assert.deepEqual(filterCases(CASES, "   "), [...CASES]);
});

test("filterCases searches IDs, titles, descriptions, categories, and topics case-insensitively", () => {
  assert.equal(filterCases(CASES, "case-001").length, 1);
  assert.equal(filterCases(CASES, "MISSING ACCOUNT").length, 1);
  assert.equal(filterCases(CASES, "timeline reconstruction").length, 1);
  assert.equal(filterCases(CASES, "fictional account-access").length, 1);
});

test("filterCases returns no results for an unknown term", () => {
  assert.deepEqual(filterCases(CASES, "quantum dishwasher"), []);
});

test("filterCases does not mutate the source catalog", () => {
  const before = JSON.stringify(CASES);
  filterCases(CASES, "log");
  assert.equal(JSON.stringify(CASES), before);
});
