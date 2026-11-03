import test from "node:test";
import assert from "node:assert/strict";
import { escapeHtml, formatCount } from "../../src/core/format.js";

test("escapeHtml escapes HTML-sensitive characters", () => {
  assert.equal(
    escapeHtml("<script title=\"x\">Tom & 'Ada'</script>"),
    "&lt;script title=&quot;x&quot;&gt;Tom &amp; &#39;Ada&#39;&lt;/script&gt;"
  );
});

test("escapeHtml preserves ordinary text", () => {
  assert.equal(escapeHtml("CASE-001 / authentication.log"), "CASE-001 / authentication.log");
});

test("formatCount formats non-negative finite numbers", () => {
  assert.equal(formatCount(12345), "12,345");
  assert.equal(formatCount(0), "0");
});

test("formatCount rejects invalid values", () => {
  assert.throws(() => formatCount(-1), RangeError);
  assert.throws(() => formatCount(Number.NaN), RangeError);
});
