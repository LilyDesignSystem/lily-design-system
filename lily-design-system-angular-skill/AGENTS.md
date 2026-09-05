# Lily Design System™ — Angular Skill

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

- **Package**: lily-design-system-angular-skill
- **Version**: 0.1.0
- **Created**: 2026-09-05
- **License**: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause or contact us for more
- **Contact**: Joel Parker Henderson (joel@joelparkerhenderson.com)

## Overview

A Claude Skill that ties together the three real Angular subprojects in
this monorepo — the headless component library
[`lily-design-system-angular-headless`](../lily-design-system-angular-headless/),
the `*-picker` helpers catalog
[`lily-design-system-angular-helpers`](../lily-design-system-angular-helpers/),
and the styled example application
[`lily-design-system-angular-examples`](../lily-design-system-angular-examples/)
— and helps an agent decide which one it needs. The skill itself is
[`SKILL.md`](SKILL.md); the `@AGENTS/*.md` files loaded above are the same
binding design-principle rules every other subproject in this repository
loads, so an agent explaining Lily's Angular support is grounded in the
same rules the three Angular implementations are held to.

It sits one level up from two more specific sibling skills:
[`lily-design-system-angular-headless-skill`](../lily-design-system-angular-headless-skill/)
(the headless library's own install/idiom/tag-selector contract) and
[`lily-design-system-angular-helpers-skill`](../lily-design-system-angular-helpers-skill/)
(the six helper packages' own contracts and Angular idiom). This skill
maps all three subprojects and points into those two for their deep-dive
content, and gives real coverage of the example app — the one Angular
subproject neither sibling skill documents.

## What this subproject is, and isn't

- **Is**: the Angular umbrella / entry-point skill — a map of the three
  real Angular subprojects, guidance on which one a given task needs, real
  coverage of the example app's routes and styling, and pointers into the
  two sibling skills for their own subject matter.
- **Isn't**: the headless component library, the helpers catalog, or the
  example app themselves — it ships no components of its own. Isn't the
  general framework-agnostic Lily concepts skill (that's
  [`lily-design-system-skill`](../lily-design-system-skill/)). Isn't a
  duplicate of either
  [`lily-design-system-angular-headless-skill`](../lily-design-system-angular-headless-skill/)
  or
  [`lily-design-system-angular-helpers-skill`](../lily-design-system-angular-helpers-skill/)
  — it points at both rather than restating their contracts.

## Internationalization

Not applicable — this subproject ships no user-facing components or
strings; it is documentation for an AI coding agent.
