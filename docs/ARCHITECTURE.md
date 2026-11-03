# NEXUS Architecture

**Status:** Initial foundation  
**Architecture style:** Lightweight layered frontend

## Current implementation

The first milestone implements:

- A static HTML entry point.
- CSS design tokens and layout styles.
- A small hash-based router.
- A static case catalog for interface development.
- Dashboard, Case Library, Case Overview, and placeholder Settings screens.
- A terminal panel shell that clearly indicates the command engine is not implemented.
- Unit tests for formatting and route resolution.

## Intended layers

### Presentation

Owns accessible DOM structure, styles, components, and user interaction. It must not implement forensic analysis algorithms.

### Application

Coordinates navigation and use cases. The UI and future terminal will call shared application services rather than duplicate business rules.

### Domain

Will own case, evidence, event, analysis, relationship, finding, and report rules. Domain logic should remain testable without a browser DOM.

### Infrastructure

Will own JSON dataset loading, IndexedDB persistence, Web Crypto integration, and browser APIs behind small interfaces.

## Dependency direction

Presentation → Application → Domain

Infrastructure implements interfaces used by the application/domain boundary. Domain logic must not depend on DOM APIs, localStorage, IndexedDB, or a specific screen.

## Current folder responsibilities

- src/app/: application bootstrap and routing.
- src/core/: shared presentation-safe utilities.
- src/data/: static demo catalog and later versioned datasets.
- src/styles/: design tokens, base rules, shell, and components.
- tests/: Node.js built-in tests.

## Constraints

- No operating-system command execution.
- No host filesystem access from the simulated terminal.
- No claims of certified forensic integrity.
- Original evidence, annotations, and derived artifacts must be separate data categories.
- Text from datasets must be rendered safely; do not interpolate untrusted strings into executable HTML.

## Next architecture decisions

Before implementing the forensic engine, specify public interfaces and data contracts for the virtual filesystem, log parser, hash service, timeline service, evidence references, and persistence adapter.
