# Lily Design System™ — Blazor Skill

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

- **Package**: lily-design-system-blazor-skill
- **Version**: 0.1.0
- **Created**: 2026-09-05
- **License**: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause or contact us for more
- **Contact**: Joel Parker Henderson (joel@joelparkerhenderson.com)

## Overview

A Claude Skill that maps the three real Blazor subprojects in this
monorepo — [`lily-design-system-blazor-headless`](../lily-design-system-blazor-headless/),
[`lily-design-system-blazor-helpers`](../lily-design-system-blazor-helpers/),
and [`lily-design-system-blazor-web-examples`](../lily-design-system-blazor-web-examples/) —
and helps an agent decide which one a given task needs. It is the Blazor
**umbrella** skill, one level up from
[`lily-design-system-blazor-headless-skill`](../lily-design-system-blazor-headless-skill/)
and [`lily-design-system-blazor-helpers-skill`](../lily-design-system-blazor-helpers-skill/).
The skill itself is [`SKILL.md`](SKILL.md); the `@AGENTS/*.md` files loaded
above are the same binding design-principle rules every other subproject in
this repository loads, so an agent routing between the three Blazor
subprojects is grounded in the same rules each of them is held to.

## What this subproject is, and isn't

- **Is**: the Blazor umbrella/entry-point skill — a map of the three real
  Blazor subprojects, guidance on which one a task needs, full coverage of
  the one subproject (the example app) that neither sibling skill covers,
  and pointers into the two sibling skills for the other two subprojects'
  deep-dive contracts.
- **Isn't**: the Blazor headless component library itself (that's
  [`lily-design-system-blazor-headless`](../lily-design-system-blazor-headless/) —
  this subproject ships no `.razor` components).
- **Isn't**: the Blazor `*-picker` helpers catalog itself (that's
  [`lily-design-system-blazor-helpers`](../lily-design-system-blazor-helpers/)).
- **Isn't**: the Blazor Web example app itself (that's
  [`lily-design-system-blazor-web-examples`](../lily-design-system-blazor-web-examples/) —
  this subproject ships no pages, no CSS, nothing runnable).
- **Isn't**: the general, framework-agnostic Lily concepts skill (that's
  [`lily-design-system-skill`](../lily-design-system-skill/)).
- **Isn't**: a duplicate of either sibling skill — it points at
  [`lily-design-system-blazor-headless-skill`](../lily-design-system-blazor-headless-skill/)
  and [`lily-design-system-blazor-helpers-skill`](../lily-design-system-blazor-helpers-skill/)
  for their deep-dive contracts rather than restating them.

## Internationalization

Not applicable — this subproject ships no user-facing components or
strings; it is documentation for an AI coding agent.
