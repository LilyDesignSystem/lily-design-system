# Lily Design System™ — Vue Skill

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

- **Package**: lily-design-system-vue-skill
- **Version**: 0.1.0
- **Created**: 2026-09-05
- **License**: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause or contact us for more
- **Contact**: Joel Parker Henderson (joel@joelparkerhenderson.com)

## Overview

A Claude Skill scoped to Vue as a whole: it maps the three real Vue
subprojects (`lily-design-system-vue-headless`,
`lily-design-system-vue-helpers`, `lily-design-system-vue-nuxt-examples`),
helps an agent pick the right one, and gives real coverage of the example
app since neither of the two more specific sibling skills covers it. The
skill itself is [`SKILL.md`](SKILL.md); the `@AGENTS/*.md` files loaded
above are the same binding design-principle rules every other subproject
in this repository loads, so an agent explaining Vue's subprojects is
grounded in the same rules those subprojects' own components are held to.

## What this subproject is, and isn't

- **Is**: the Vue umbrella / entry-point skill — a map of the three real
  Vue subprojects, a decision guide for which one a task needs, and the
  one place the Nuxt.js example app's routes and conventions are covered.
- **Isn't**: the Vue headless component library itself, the Vue helpers
  catalog itself, or the Nuxt.js example app itself — this subproject
  ships no components, no build, no tests beyond `bin/test`'s
  required-files checks.
- **Isn't**: the general, framework-agnostic Lily concepts skill (that's
  [`lily-design-system-skill`](../lily-design-system-skill/) — terminology,
  the catalog shape, naming conventions and composition patterns
  independent of any one framework's syntax).
- **Isn't**: a duplicate of either sibling skill (that's
  [`lily-design-system-vue-headless-skill`](../lily-design-system-vue-headless-skill/)
  and
  [`lily-design-system-vue-helpers-skill`](../lily-design-system-vue-helpers-skill/)
  — their own install/import/consumption idioms and contracts are theirs
  to own; this subproject only points at them).

## Internationalization

Not applicable — this subproject ships no user-facing components or
strings; it is documentation for an AI coding agent.
