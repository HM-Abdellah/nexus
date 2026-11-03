# NEXUS

**NEXUS — Digital Forensics Training Workbench**

A browser-based training environment for investigating, analyzing, and correlating **synthetic digital evidence**.

> **Project status:** Early development. The current milestone establishes the application foundation and visual system. Forensic analysis features are planned and are not yet implemented.

## Product goals

- Explore a virtual, read-only evidence dataset.
- Inspect file metadata and synthetic system logs.
- Run transparent, reproducible analysis operations.
- Reconstruct event timelines and correlate observations.
- Trace findings back to their source evidence.
- Produce structured investigation reports.

NEXUS is an educational simulation. It is not a certified forensic tool and does not provide legally admissible evidence or certified chain-of-custody guarantees.

## Technology baseline

- HTML5, CSS3, and vanilla JavaScript (ES modules)
- JSON case datasets
- IndexedDB for investigation state
- Web Crypto API for supported hashing operations
- Node.js built-in test runner
- GitHub Actions for continuous integration

Frameworks and dependencies will only be introduced when a documented requirement justifies them.

## Getting started

The project is currently a static browser application. From the repository root, start a local static HTTP server, for example:

```bash
python3 -m http.server 4173 --bind 0.0.0.0
```

Then open the forwarded port **4173** in your development environment.

Run the automated tests with:

```bash
npm test
```

## Project structure

```text
.
├── docs/                 # Product and engineering documentation
├── src/
│   ├── app/              # Application bootstrap and navigation
│   ├── core/             # Shared application utilities
│   ├── data/              # Demo content and future case datasets
│   └── styles/           # Design tokens and interface styles
├── tests/                # Automated tests
├── index.html
└── package.json
```

## Design direction

- **Visual identity:** Graphite, deep navy, and restrained teal.
- **Information density:** Balanced.
- **Typography:** Inter for interface text; JetBrains Mono for technical output, with system fallbacks.
- **Interaction:** Desktop-first, keyboard-accessible, and responsive down to smaller laptop widths.
- **Terminal:** A simulated command environment only. It will never execute host operating-system commands or access the host filesystem.

## Engineering principles

1. Keep presentation separate from domain and application logic.
2. Keep original synthetic evidence separate from notes and derived artifacts.
3. Make analysis results traceable to their input evidence.
4. Validate all imported or displayed data.
5. Test critical logic and document limitations honestly.
6. Prefer small, reviewable changes over broad unfinished features.

## Documentation

Engineering documentation lives in [`docs/`](docs/). The specifications will evolve alongside implementation; approved decisions and deferred proposals must remain distinguishable.

## License

No license has been selected yet. Until a license is added, the repository is publicly viewable but reuse and redistribution are not granted by default.

## Status

See the project roadmap and current GitHub milestones for implementation progress.
