export async function sha256Hex(value, cryptoProvider = globalThis.crypto) {
  if (typeof value !== "string") {
    throw new TypeError("SHA-256 input must be a string.");
  }

  if (!cryptoProvider?.subtle || typeof cryptoProvider.subtle.digest !== "function") {
    throw new Error("Web Crypto API is not available in this environment.");
  }

  const encodedValue = new TextEncoder().encode(value);
  const digest = await cryptoProvider.subtle.digest("SHA-256", encodedValue);

  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
}
