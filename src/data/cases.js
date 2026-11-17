export const CASES = Object.freeze([
  Object.freeze({
    id: "CASE-001",
    title: "The Missing Account",
    category: "Account Activity Investigation",
    description: "Examine a fictional account-access incident using synthetic authentication records and system logs. Reconstruct what the available evidence supports, and document unresolved questions.",
    difficulty: "Medium",
    estimatedDuration: "30–45 min",
    status: "available",
    topics: Object.freeze([
      "Log analysis",
      "Timestamp handling",
      "Timeline reconstruction",
      "Evidence correlation"
    ])
  })
]);

export function findCaseById(caseId) {
  return CASES.find((item) => item.id === caseId) ?? null;
}

export function filterCases(cases, query = "") {
  const normalizedQuery = String(query).trim().toLowerCase();

  if (!normalizedQuery) return [...cases];

  return cases.filter((item) => {
    const searchableText = [
      item.id,
      item.title,
      item.category,
      item.description,
      ...item.topics
    ].join(" ").toLowerCase();

    return searchableText.includes(normalizedQuery);
  });
}
