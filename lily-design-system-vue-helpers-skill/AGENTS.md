# Lily Design System™ — Vue Helpers Skill

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

- **Package**: lily-design-system-vue-helpers-skill
- **Version**: 0.1.0
- **Created**: 2026-09-04
- **License**: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause or contact us for more
- **Contact**: Joel Parker Henderson (joel@joelparkerhenderson.com)

## Overview

A Claude Skill scoped to consuming the six packages in
[`lily-design-system-vue-helpers`](../lily-design-system-vue-helpers/):
`theme-picker`, `locale-picker`, `text-size-picker`, `motion-picker`,
`share-picker`, `date-time-picker`. Covers each package's npm name and
install command, the three shared contract shapes (icon-button-plus-
listbox for the four preference helpers, disclosure-of-links for
`share-picker`, field-plus-dialog for `date-time-picker`), and the Vue 3
Composition API idiom this catalog expects (`v-model` via
`defineModel()`, `v-bind="$attrs"`, prop-driven labels, SSR-safe
`onMounted`/`watch` DOM writes, idempotent apply). The skill itself is
[`SKILL.md`](SKILL.md); the `@AGENTS/*.md` files loaded above are the same
binding design-principle rules every other subproject in this repository
loads, so an agent explaining this catalog's usage is grounded in the
same rules the packages themselves are held to.

## What this subproject is, and isn't

- **Is**: a distributable skill scoped to *consuming* the Vue
  `*-picker` helper packages from a Vue 3 application — install, import,
  `v-model` binding, attribute fallthrough, the three shape families.
- **Isn't**: the Vue helpers catalog itself (that's
  [`lily-design-system-vue-helpers`](../lily-design-system-vue-helpers/) —
  this subproject ships no components, no build, no tests beyond
  `bin/test`'s required-files checks).
- **Isn't**: the general, framework-agnostic Lily concepts skill (that's
  [`lily-design-system-skill`](../lily-design-system-skill/)).
- **Isn't**: the Vue headless component skill (that's
  [`lily-design-system-vue-headless-skill`](../lily-design-system-vue-headless-skill/)
  — the 491-component catalog, a separate npm package with a separate
  contract).

## Internationalization

Not applicable — this subproject ships no user-facing components or
strings; it is documentation for an AI coding agent.
