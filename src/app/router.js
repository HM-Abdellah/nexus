export function resolveRoute(hash = "") {
  const rawPath = String(hash).startsWith("#") ? String(hash).slice(1) : String(hash);
  const path = (rawPath.split("?")[0] || "/dashboard").replace(/\/+$/, "") || "/dashboard";

  if (path === "/" || path === "/dashboard") return { name: "dashboard" };
  if (path === "/cases") return { name: "cases" };

  const caseMatch = path.match(/^\/cases\/([A-Za-z0-9-]+)$/);
  if (caseMatch) return { name: "case-overview", caseId: caseMatch[1] };

  if (path === "/settings") return { name: "settings" };
  return { name: "not-found" };
}
