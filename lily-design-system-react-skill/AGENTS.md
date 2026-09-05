# Lily Design System™ — React Skill

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

- **Package**: lily-design-system-react-skill
- **Version**: 0.1.0
- **Created**: 2026-09-05
- **License**: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause or contact us for more
- **Contact**: Joel Parker Henderson (joel@joelparkerhenderson.com)

## Overview

A Claude Skill mapping the three real React subprojects in this
monorepo —
[`lily-design-system-react-headless`](../lily-design-system-react-headless/)
(the headless component library),
[`lily-design-system-react-helpers`](../lily-design-system-react-helpers/)
(the six `*-picker` helper packages), and
[`lily-design-system-react-next-examples`](../lily-design-system-react-next-examples/)
(the styled Next.js reference app) — and helping an agent decide which
one it needs. The skill itself is [`SKILL.md`](SKILL.md); the
`@AGENTS/*.md` files loaded above are the same binding design-principle
rules every other subproject in this repository loads, so an agent
routing between the three React subprojects is grounded in the same
rules each subproject's own implementation is held to.

## What this subproject is, and isn't

- **Is**: the React **umbrella** skill — an entry point that maps the
  three real React subprojects, explains when to reach for each, and
  routes to the deeper sibling skills for the two that are npm
  packages.
- **Isn't**: the headless library, the helpers catalog, or the example
  app themselves — it ships no components, no helper packages, no
  example pages. Isn't the general, framework-agnostic
  [`lily-design-system-skill`](../lily-design-system-skill/), which
  this skill assumes as prior grounding. Isn't a duplicate of
  [`lily-design-system-react-headless-skill`](../lily-design-system-react-headless-skill/)
  or
  [`lily-design-system-react-helpers-skill`](../lily-design-system-react-helpers-skill/) —
  it points at both rather than restating their install commands, prop
  conventions, or gotchas.

## Internationalization

Not applicable — this subproject ships no user-facing components or
strings; it is documentation for an AI coding agent.
