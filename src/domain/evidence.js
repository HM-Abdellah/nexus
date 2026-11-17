const REQUIRED_STRING_FIELDS = Object.freeze([
  "id",
  "caseId",
  "name",
  "type",
  "source",
  "collectedAt",
  "description",
  "content"
]);

const ALLOWED_EVIDENCE_TYPES = new Set(["log", "event-log", "metadata"]);

export function validateEvidenceRecord(record) {
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    throw new TypeError("Evidence record must be an object.");
  }

  for (const field of REQUIRED_STRING_FIELDS) {
    if (typeof record[field] !== "string" || record[field].trim() === "") {
      throw new TypeError(`Evidence field "${field}" must be a non-empty string.`);
    }
  }

  if (!/^EVD-[0-9]{3}$/.test(record.id)) {
    throw new TypeError("Evidence ID must use the EVD-### format.");
  }

  if (!ALLOWED_EVIDENCE_TYPES.has(record.type)) {
    throw new TypeError("Evidence type is not supported.");
  }

  const isoUtcTimestamp = /^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z$/;
  const parsedTimestamp = new Date(record.collectedAt);

  if (
    !isoUtcTimestamp.test(record.collectedAt) ||
    Number.isNaN(parsedTimestamp.getTime()) ||
    parsedTimestamp.toISOString() !== record.collectedAt
  ) {
    throw new TypeError("Evidence collection timestamp must be a valid ISO-8601 UTC timestamp.");
  }

  return true;
}

export function getEvidenceForCase(records, caseId) {
  if (!Array.isArray(records)) {
    throw new TypeError("Evidence collection must be an array.");
  }

  return records.filter((record) => {
    validateEvidenceRecord(record);
    return record.caseId === caseId;
  });
}

export function findEvidenceById(records, evidenceId) {
  if (!Array.isArray(records)) {
    throw new TypeError("Evidence collection must be an array.");
  }

  const match = records.find((record) => record.id === evidenceId) ?? null;
  if (match) validateEvidenceRecord(match);
  return match;
}

export function filterEvidence(records, query = "") {
  if (!Array.isArray(records)) {
    throw new TypeError("Evidence collection must be an array.");
  }

  for (const record of records) validateEvidenceRecord(record);

  const normalizedQuery = String(query).trim().toLowerCase();
  if (!normalizedQuery) return [...records];

  return records.filter((record) => {
    const searchableText = [
      record.id,
      record.name,
      record.type,
      record.source,
      record.description
    ].join(" ").toLowerCase();

    return searchableText.includes(normalizedQuery);
  });
}

export function getEvidenceSizeBytes(record) {
  validateEvidenceRecord(record);
  return new TextEncoder().encode(record.content).byteLength;
}

export function formatBytes(byteLength) {
  if (!Number.isSafeInteger(byteLength) || byteLength < 0) {
    throw new RangeError("Byte length must be a safe, non-negative integer.");
  }

  if (byteLength < 1024) return `${byteLength} B`;
  if (byteLength < 1024 * 1024) return `${(byteLength / 1024).toFixed(1)} KB`;
  return `${(byteLength / (1024 * 1024)).toFixed(1)} MB`;
}
