# Lily Design System™ — Blazor Helpers Skill

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

- **Package**: lily-design-system-blazor-helpers-skill
- **Version**: 0.1.0
- **Created**: 2026-09-04
- **License**: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause or contact us for more
- **Contact**: Joel Parker Henderson (joel@joelparkerhenderson.com)

## Overview

A Claude Skill explaining how to install and use
[`lily-design-system-blazor-helpers`](../lily-design-system-blazor-helpers/),
the Blazor catalog of six `*-picker` helper packages. The skill itself is
[`SKILL.md`](SKILL.md); the `@AGENTS/*.md` files loaded above are the same
binding design-principle rules every other subproject in this repository
loads — including [`AGENTS/helpers.md`](../AGENTS/helpers.md), the canonical
cross-framework `*-picker` contract every Blazor helper implements — so an
agent explaining Blazor helper consumption is grounded in the same rules the
helpers themselves are held to.

## What this subproject is, and isn't

- **Is**: a distributable skill scoped to *consuming* Lily's Blazor
  `*-picker` helper packages — NuGet install per package, the shared
  icon-button/listbox contract and its two exceptions (`share-picker`,
  `date-time-picker`), and the Blazor-specific `IJSRuntime`/SSR pattern.
- **Isn't**: the Blazor helpers catalog itself (that's
  [`lily-design-system-blazor-helpers`](../lily-design-system-blazor-helpers/) —
  this subproject ships no `.razor` components, no tests beyond its own
  required-files check).
- **Isn't**: the general, framework-agnostic Lily concepts skill (that's
  [`lily-design-system-skill`](../lily-design-system-skill/)).
- **Isn't**: the Blazor headless component catalog skill (that's
  [`lily-design-system-blazor-headless-skill`](../lily-design-system-blazor-headless-skill/) —
  the headless library is a separate, lower-level catalog of pure markup
  primitives with no owned lifecycle).

## Internationalization

Not applicable — this subproject ships no user-facing components or
strings; it is documentation for an AI coding agent.
