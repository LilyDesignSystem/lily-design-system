# Lily Design System™ — React Helpers Skill

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

- **Package**: lily-design-system-react-helpers-skill
- **Version**: 0.1.0
- **Created**: 2026-09-04
- **License**: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause or contact us for more
- **Contact**: Joel Parker Henderson (joel@joelparkerhenderson.com)

## Overview

A Claude Skill explaining how to install and use the React
implementation of Lily Design System™'s six `*-picker` helper
packages —
[`lily-design-system-react-helpers/`](../lily-design-system-react-helpers/)'s
`theme-picker`, `locale-picker`, `text-size-picker`, `motion-picker`,
`share-picker`, and `date-time-picker`. The skill itself is
[`SKILL.md`](SKILL.md); the `@AGENTS/*.md` files loaded above are the
same binding design-principle rules every other subproject in this
repository loads, so an agent explaining a helper's usage is grounded
in the same rules — including `AGENTS/helpers.md`'s shared picker
contract — the helper's own implementation is held to.

## What this subproject is, and isn't

- **Is**: a distributable skill covering how to consume the six React
  `*-picker` helper packages in a React application — install, the
  icon-button-plus-listbox / disclosure-of-links / field-plus-dialog
  shapes, controlled `value`/`onChange`, render-prop `children`, the
  `"use client"` SSR boundary, and the idempotent-apply guard — for
  people building *with* them.
- **Isn't**: the React helpers catalog itself (that's
  [`lily-design-system-react-helpers`](../lily-design-system-react-helpers/),
  which ships the actual packages), isn't the general
  framework-agnostic Lily skill (that's
  [`lily-design-system-skill`](../lily-design-system-skill/)), and
  isn't the React headless components skill (that's
  [`lily-design-system-react-headless-skill`](../lily-design-system-react-headless-skill/)).

## Internationalization

Not applicable — this subproject ships no user-facing components or
strings; it is documentation for an AI coding agent.
