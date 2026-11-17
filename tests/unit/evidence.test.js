import test from "node:test";
import assert from "node:assert/strict";
import { CASE_001_EVIDENCE } from "../../src/data/evidence/case-001.js";
import {
  filterEvidence,
  formatBytes,
  getEvidenceForCase,
  getEvidenceSizeBytes,
  validateEvidenceRecord
} from "../../src/domain/evidence.js";

test("synthetic evidence records satisfy the domain contract", () => {
  assert.equal(CASE_001_EVIDENCE.length, 3);
  for (const record of CASE_001_EVIDENCE) {
    assert.equal(validateEvidenceRecord(record), true);
  }
});

test("evidence can be selected by case ID", () => {
  assert.equal(getEvidenceForCase(CASE_001_EVIDENCE, "CASE-001").length, 3);
  assert.deepEqual(getEvidenceForCase(CASE_001_EVIDENCE, "CASE-999"), []);
});

test("evidence search matches IDs, names, sources, and descriptions", () => {
  assert.equal(filterEvidence(CASE_001_EVIDENCE, "EVD-002").length, 1);
  assert.equal(filterEvidence(CASE_001_EVIDENCE, "AUTHENTICATION").length, 1);
  assert.equal(filterEvidence(CASE_001_EVIDENCE, "virtual file catalogue").length, 1);
  assert.equal(filterEvidence(CASE_001_EVIDENCE, "fictional demo account").length, 1);
});

test("empty evidence search returns a new collection without mutating the source", () => {
  const result = filterEvidence(CASE_001_EVIDENCE, "  ");
  assert.deepEqual(result, [...CASE_001_EVIDENCE]);
  assert.notEqual(result, CASE_001_EVIDENCE);
});

test("invalid evidence records are rejected", () => {
  assert.throws(() => validateEvidenceRecord(null), TypeError);
  assert.throws(() => validateEvidenceRecord({
    ...CASE_001_EVIDENCE[0],
    id: "INVALID"
  }), /EVD-###/);
  assert.throws(() => validateEvidenceRecord({
    ...CASE_001_EVIDENCE[0],
    type: "unknown"
  }), /not supported/);
});

test("evidence size uses UTF-8 byte length", () => {
  const record = {
    ...CASE_001_EVIDENCE[0],
    content: "é"
  };
  assert.equal(getEvidenceSizeBytes(record), 2);
  assert.equal(formatBytes(2), "2 B");
  assert.equal(formatBytes(1536), "1.5 KB");
  assert.throws(() => formatBytes(-1), RangeError);
});
