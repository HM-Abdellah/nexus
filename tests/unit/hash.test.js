import test from "node:test";
import assert from "node:assert/strict";
import { webcrypto } from "node:crypto";
import { sha256Hex } from "../../src/core/hash.js";

test("sha256Hex returns the standard SHA-256 digest", async () => {
  assert.equal(
    await sha256Hex("hello", webcrypto),
    "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"
  );
});

test("sha256Hex handles UTF-8 input", async () => {
  assert.equal(
    await sha256Hex("NEXUS — أدلة اصطناعية", webcrypto).then((value) => value.length),
    64
  );
});

test("sha256Hex rejects unsupported input and missing Web Crypto", async () => {
  await assert.rejects(() => sha256Hex(42, webcrypto), TypeError);
  await assert.rejects(() => sha256Hex("hello", {}), /Web Crypto API/);
});
