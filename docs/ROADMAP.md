# NEXUS Product Roadmap

NEXUS is being developed as an independent educational software product. Work is organized around small milestones with tested, reviewable outcomes.

## N0 — Foundation hardening

**Goal:** Make the current application safe to extend and easy to validate.

- [x] Restrict the local preview server to approved app assets.
- [x] Keep search usable on narrow screens.
- [x] Extract case and evidence filtering into testable functions.
- [x] Add syntax checks and unit tests.
- [x] Add a static build that excludes development-only files.

## N1 — Evidence Explorer

**Goal:** Let learners inspect a small, read-only synthetic evidence set.

- [x] Define a validated evidence-record contract.
- [x] Add synthetic evidence records to CASE-001.
- [x] Filter evidence by identifying details and description.
- [x] Preview original content without editing it.
- [x] Calculate a local SHA-256 digest for the selected content.
- [ ] Add explicit error states for malformed case datasets.
- [ ] Add UI-level interaction tests.

## N2 — Event parsing and normalization

**Goal:** Convert the supported synthetic log formats into normalized event records.

- Define a strict event data contract.
- Parse only documented training formats.
- Validate timestamps and required fields.
- Preserve a reference from every normalized event to its source evidence and line.
- Add tests for malformed lines, unknown event types, and timezone handling.

## N3 — Timeline reconstruction

**Goal:** Present normalized events in a consistent, sortable timeline.

- Normalize timestamps to UTC while preserving their original value.
- Sort events deterministically.
- Show missing or ambiguous timestamps rather than guessing.
- Link every event to the source evidence and line.
- Explain that a timeline is an analytical view, not proof of causation.

## N4 — Correlation and findings

**Goal:** Help learners compare observations across synthetic records.

- Support a small set of transparent correlation rules.
- Explain why two records are shown together.
- Keep observations separate from interpretations.
- Record uncertainty and alternative explanations.
- Never fabricate evidence or silently fill missing facts.

## N5 — Investigation notes and reports

**Goal:** Let a learner produce a structured account of their work.

- Keep user notes separate from original evidence.
- Attribute every finding to one or more source records.
- Distinguish facts, interpretations, and unanswered questions.
- Export a report with dataset version and analysis limitations.
- Keep local-only storage until a backend is justified.

## N6 — Interactive learning experience

**Goal:** Turn cases into guided exercises without hiding the reasoning process.

- Add case objectives and staged hints.
- Explain relevant concepts in context.
- Provide feedback against an explicit rubric.
- Let learners retry and compare their reasoning.
- Make scoring transparent and separate from evidence analysis.

## N7 — Public release

**Goal:** Publish a stable static version and invite contributions.

- Deploy from `main` only.
- Keep development branches and pull requests out of production.
- Add a clear installation guide, contribution guide, and release notes.
- Select an explicit license before inviting reuse.
- Review accessibility, browser support, security, and performance.

## Product constraints

- All bundled training evidence must be fictional and synthetic.
- The application must not execute operating-system commands or inspect a host filesystem.
- Original evidence is immutable; notes and derived results are separate.
- Hashes demonstrate content integrity relative to a known value, not authenticity or provenance.
- NEXUS is an educational simulation, not a certified forensic tool.
