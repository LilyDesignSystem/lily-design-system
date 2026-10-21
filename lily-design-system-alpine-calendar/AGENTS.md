# Lily Design System™ — Alpine.js CalendarView

@AGENTS/lily.md
@AGENTS/theme.md
@AGENTS/components.md
@AGENTS/accessibility.md
@AGENTS/internationalization.md
@AGENTS/headless.md
@AGENTS/helpers.md
@AGENTS/examples.md
@AGENTS/citations.md
@AGENTS/nhs-uk-design-system-references.md

## Metadata

- **Package**: @lilydesignsystem/alpine-calendar
- **Version**: 0.1.0
- **Created**: 2026-10-21
- **License**: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause or contact us for more
- **Contact**: Joel Parker Henderson (joel@joelparkerhenderson.com)

## Overview

A headless Alpine.js calendar: month and week views, picked and disabled days, events, APG date-grid keys — a subset of the Svelte reference.

Alpine helpers are TypeScript built with tsup: a plugin registering `Alpine.data("…")`, plus `snippet.html`, the markup that
uses it. Svelte is the canonical contract ([spec/helpers](../spec/helpers/index.md)); this package implements the subset its
`spec/index.md` lists and says plainly what is not built.

## Rules

- Headless: no CSS, no text, no icons. Every user-facing string is a `labels.*` value; a label's presence shows the control it names.
- Shared pure modules (`search-text`, `grid-navigation`, `export-data`, `direction`, …) are copies of `shared/`; edit `shared/` and run `bin/sync-shared-modules`.
- Do not add a prop here that the Svelte helper does not have; ports follow Svelte.

## Commands

- `pnpm install`, `pnpm test` (21 tests), `pnpm build`.
