# NEXUS Design System

**Status:** Initial implementation baseline  
**Version:** 0.1.0

## Direction

NEXUS uses a restrained Graphite + Deep Navy + Teal visual identity. The interface should feel like a professional investigation workbench: dense enough for structured data, but calm and readable.

## Approved decisions

- Desktop-first; responsive down to smaller screens.
- Balanced information density.
- Inter/system sans-serif stack for interface text.
- JetBrains Mono/system monospace stack for terminal and technical identifiers.
- Lucide-inspired outline iconography.
- Teal is an interaction accent, not a decorative background color.
- Semantic states must not rely on color alone.

## Core color tokens

| Token | Value | Use |
|---|---|---|
| --color-bg | #0B1118 | Application background |
| --color-sidebar | #0E1721 | Sidebar |
| --color-surface | #111B26 | Cards and panels |
| --color-surface-raised | #172432 | Raised surfaces |
| --color-terminal | #080D13 | Terminal surface |
| --color-text-primary | #E8EFF5 | Primary text |
| --color-text-secondary | #A5B3C2 | Secondary text |
| --color-text-muted | #78899A | Metadata |
| --color-border-subtle | #334252 | Subtle borders |
| --color-border-strong | #566B7E | High-visibility borders |
| --color-accent | #50C8B2 | Primary actions |
| --color-accent-hover | #72D8C4 | Hover |
| --color-focus | #80D8CB | Focus indicators |
| --color-success | #55B88A | Success |
| --color-warning | #E6B85C | Warning |
| --color-danger | #E7797D | Error |
| --color-info | #70AEE8 | Informational |

The palette is a starting point. Contrast must be checked on actual component combinations before release, especially muted metadata, borders, and colored badges.

## Typography

The current stack references Inter and JetBrains Mono but does not download or bundle font files. Local font assets may be added after license and file-size review.

- Page title: 24–30px, semibold.
- Section title: 16px, semibold.
- Body: 14px.
- Table text: 13px.
- Metadata: 11–12px.
- Terminal: 13px monospace.

## Layout

- Top bar: 56px.
- Expanded sidebar: 248px.
- Collapsed sidebar: 68px.
- Main content padding: 24px desktop; 16px compact.
- Standard panel radius: 8–12px.
- Spacing base: 4px.

These dimensions may be refined after screen-level mockup review.

## Component states

Interactive components must define default, hover, focus-visible, active, and disabled states. Loading and error states are required where operations can take time or fail.

## Accessibility

- Use semantic HTML and accessible names.
- Preserve visible keyboard focus.
- Support keyboard navigation.
- Respect prefers-reduced-motion.
- Never communicate status by color alone.
- Verify text contrast and focus visibility before release.
