const HTML_ESCAPE_MAP = Object.freeze({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
});

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => HTML_ESCAPE_MAP[character]);
}

export function formatCount(value) {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError("Count must be a finite, non-negative number.");
  }

  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);
}
