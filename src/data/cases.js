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
