# NEXUS Architecture

**Status:** Early implementation  
**Architecture style:** Lightweight layered frontend

## Current implementation

- Static HTML entry point and responsive CSS design system.
- Hash-based client-side router.
- Dashboard, Case Library, Case Overview, and placeholder Settings screen.
- Synthetic case catalog and three-record evidence dataset for CASE-001.
- Evidence Explorer with filtering, read-only content preview, and local SHA-256 calculation.
- Evidence domain validation and search functions.
- Restricted local preview server and static-site build script.
- Node.js built-in unit tests and GitHub Actions CI.

## Intended layers

### Presentation

Owns accessible DOM structure, styles, components, and user interaction. It must not implement forensic analysis algorithms.

### Application

Coordinates navigation and use cases. Views call shared domain functions instead of duplicating business rules.

### Domain

Owns evidence validation, case relationships, event normalization, timeline rules, findings, and report rules. Domain logic must remain testable without a browser DOM.

Current domain entry point:
- `src/domain/evidence.js`: evidence-record validation, case selection, filtering, and content-size helpers.

### Infrastructure

Will own dataset loading, IndexedDB persistence, Web Crypto integration, and browser APIs behind small interfaces.

Current browser helper:
- `src/core/hash.js`: SHA-256 digest generation via the Web Crypto API. It calculates a digest of the supplied text; it does not establish provenance or authenticity.

## Dependency direction

Presentation → Application → Domain

Infrastructure implements interfaces used by the application/domain boundary. Domain logic must not depend on DOM APIs, localStorage, IndexedDB, or a specific screen.

## Current folder responsibilities

- `src/app/`: application bootstrap, rendering, and routing.
- `src/core/`: shared helpers such as formatting, safe HTML escaping, and hashing.
- `src/data/`: static case catalog and explicitly synthetic evidence datasets.
- `src/domain/`: validation and domain rules without DOM dependencies.
- `src/styles/`: design tokens, base rules, shell, and components.
- `scripts/`: local preview server and static deployment build.
- `tests/`: automated tests.

## Evidence data contract

An evidence record contains:

- `id`: stable identifier using the `EVD-###` format.
- `caseId`: owning training case.
- `name`: human-readable filename or artifact label.
- `type`: supported category such as `log`, `event-log`, or `metadata`.
- `source`: fictional source label within the training environment.
- `collectedAt`: ISO-8601 timestamp.
- `description`: short explanation of the record.
- `content`: original synthetic text content.

The dataset is read-only in the current milestone. User annotations and future derived analysis artifacts must be stored separately; they must never mutate original evidence content.

## Constraints

- No operating-system command execution.
- No host filesystem access from the simulated terminal.
- No claims of certified forensic integrity.
- All current evidence must be synthetic and clearly identified as such.
- Text from datasets must be rendered safely; do not interpolate untrusted strings into executable HTML.
- A digest is an integrity fingerprint, not proof of authorship, origin, or authenticity.

## Next architecture decisions

Before implementing timeline reconstruction and correlation, specify data contracts for normalized events, evidence references, derived findings, investigation notes, and the report export format.
