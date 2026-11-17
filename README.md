# NEXUS

**NEXUS — Digital Forensics Training Workbench**

A browser-based learning environment for exploring and analyzing **synthetic digital evidence** through small, transparent, and reproducible investigation exercises.

> **Project status:** Early development. The current build includes the application foundation and an interactive evidence explorer for one synthetic training case. Timeline reconstruction, evidence correlation, investigation notes, and report generation are planned features and are not yet implemented.

## What works today

- Dashboard and case library.
- One fictional training case: `CASE-001 — The Missing Account`.
- Three read-only synthetic evidence records: authentication events, application events, and file metadata.
- Evidence filtering and metadata inspection.
- Local SHA-256 digest calculation using the browser Web Crypto API.
- Responsive interface, hash-based navigation, and unit tests.

The SHA-256 feature demonstrates a content-integrity check. A digest does **not** prove who created a record, where it originated, or that it is authentic.

## Product direction

NEXUS is intended to grow into an interactive digital forensics learning platform:

- Explore a virtual, read-only evidence dataset.
- Inspect file metadata and synthetic system logs.
- Run transparent, reproducible analysis operations.
- Reconstruct event timelines and correlate observations.
- Trace findings back to their source evidence.
- Produce structured investigation reports.
- Introduce guided training cases with hints and learning feedback.

NEXUS is an educational simulation. It is not a certified forensic tool and does not provide legally admissible evidence or certified chain-of-custody guarantees. All current case records are synthetic; the application does not access a host filesystem or real user devices.

## Technology

- HTML5 and CSS3.
- Vanilla JavaScript with ES modules.
- Node.js 26 for development tooling and tests.
- Browser Web Crypto API for SHA-256.
- Node.js built-in test runner.
- GitHub Actions for continuous integration and static-site deployment.

No runtime dependencies are currently required.

## Development

Use GitHub Codespaces or a local Node.js 26 installation.

Start the local preview server:

```bash
npm run dev
```

Open port **4173** when the development environment forwards it.

Run syntax checks, unit tests, and a production-style static build:

```bash
npm run check
npm test
npm run build
```

The static deployment artifact is generated in `dist/`. It contains only the application entry point and browser assets; project documentation, tests, development scripts, and repository metadata are not copied into the site artifact.

## Project structure

```text
.
├── .devcontainer/          # Reproducible Codespaces environment
├── .github/workflows/      # CI and GitHub Pages workflows
├── docs/                   # Product and engineering documentation
├── scripts/                # Local preview and static build tools
├── src/
│   ├── app/                # Application bootstrap, views, and routing
│   ├── core/               # Shared helpers and browser hashing
│   ├── data/               # Case catalog and synthetic evidence datasets
│   ├── domain/              # Evidence validation and domain rules
│   └── styles/              # Design tokens and interface styles
├── tests/unit/              # Automated unit tests
├── index.html
└── package.json
```

## Engineering principles

1. Keep presentation separate from application, domain, and infrastructure concerns.
2. Keep original synthetic evidence separate from notes and derived artifacts.
3. Make every analysis result traceable to its input evidence.
4. Validate imported or displayed data and escape text before rendering it.
5. Test critical logic and document limitations honestly.
6. Prefer small, reviewable changes over broad unfinished features.

## Deployment

The project is prepared for GitHub Pages deployment from the `main` branch only. The deployment workflow builds the static site into `dist/` and publishes that artifact after changes reach `main`. Development branches and pull requests do not publish the public site.

The Pages site must be enabled for the repository using **GitHub Actions** as its deployment source before the first successful publication.

## License

No license has been selected yet. Until a license is added, the repository is publicly viewable but reuse and redistribution are not granted by default.

## Status

See [docs/ROADMAP.md](docs/ROADMAP.md) for the planned development sequence.
