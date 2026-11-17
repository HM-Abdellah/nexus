export const CASE_001_EVIDENCE = Object.freeze([
  Object.freeze({
    id: "EVD-001",
    caseId: "CASE-001",
    name: "authentication-events.log",
    type: "log",
    source: "training-workstation-01 / authentication subsystem",
    collectedAt: "2026-10-12T09:00:00.000Z",
    description: "Synthetic authentication events for the fictional demo account demo-104.",
    content: [
      "2026-10-12T08:41:12.000Z INFO auth.login.success account=demo-104 host=training-workstation-01 session=demo-sess-01",
      "2026-10-12T08:44:03.000Z WARN auth.login.failed account=demo-104 host=training-workstation-01 reason=invalid_demo_credential",
      "2026-10-12T08:46:20.000Z INFO auth.session.closed account=demo-104 session=demo-sess-01"
    ].join("\n")
  }),
  Object.freeze({
    id: "EVD-002",
    caseId: "CASE-001",
    name: "application-events.log",
    type: "event-log",
    source: "training-workstation-01 / demo application monitor",
    collectedAt: "2026-10-12T09:02:00.000Z",
    description: "Synthetic activity records from a fictional note-taking application.",
    content: [
      "2026-10-12T08:42:07.000Z INFO app.started name=notes-demo process_id=4201",
      "2026-10-12T08:43:11.000Z INFO app.document.opened name=training-note.txt process_id=4201",
      "2026-10-12T08:45:58.000Z INFO app.document.closed name=training-note.txt process_id=4201"
    ].join("\n")
  }),
  Object.freeze({
    id: "EVD-003",
    caseId: "CASE-001",
    name: "training-file-metadata.json",
    type: "metadata",
    source: "training-workstation-01 / virtual file catalogue",
    collectedAt: "2026-10-12T09:05:00.000Z",
    description: "Synthetic metadata for a fictional training artifact. No real user files are included.",
    content: JSON.stringify({
      artifact_name: "training-note.txt",
      owner: "demo-user-104",
      created_at: "2026-10-12T08:30:00.000Z",
      modified_at: "2026-10-12T08:43:11.000Z",
      classification: "synthetic-training-artifact"
    }, null, 2)
  })
]);
