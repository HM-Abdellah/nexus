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
- Node.js 26 LTS for development tooling and tests
- JSON case datasets
- IndexedDB for investigation state
- Web Crypto API for supported hashing operations
- Node.js built-in test runner
- GitHub Actions for continuous integration

No runtime dependencies are currently required.

## Development

Open the repository in GitHub Codespaces or use a local Node.js 26 installation.

Start the local preview server:

\`\`\`bash
npm run dev
\`\`\`

Open port **4173** when the development environment forwards it.

Run the syntax checks and unit tests:

\`\`\`bash
npm run check
npm test
\`\`\`

## Project structure

\`\`\`text
.
├── .devcontainer/         # Reproducible Codespaces environment
├── .github/workflows/     # Continuous integration
├── docs/                  # Product and engineering documentation
├── scripts/               # Local development utilities
├── src/
│   ├── app/               # Application bootstrap and navigation
│   ├── core/              # Shared application utilities
│   ├── data/              # Demo content and future case datasets
│   └── styles/            # Design tokens and interface styles
├── tests/                 # Automated tests
├── index.html
└── package.json
\`\`\`

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

Engineering documentation lives in the docs directory. The specifications will evolve alongside implementation; approved decisions and deferred proposals must remain distinguishable.

## License

No license has been selected yet. Until a license is added, the repository is publicly viewable but reuse and redistribution are not granted by default.

## Status

See the project roadmap and current GitHub milestones for implementation progress.
