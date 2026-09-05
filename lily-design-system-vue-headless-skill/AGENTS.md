# Lily Design System™ — Vue Headless Skill

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

- **Package**: lily-design-system-vue-headless-skill
- **Version**: 0.1.0
- **Created**: 2026-09-04
- **License**: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause or contact us for more
- **Contact**: Joel Parker Henderson (joel@joelparkerhenderson.com)

## Overview

A Claude Skill scoped to consuming
[`lily-design-system-vue-headless`](../lily-design-system-vue-headless/):
the Vue 3 Composition API idiom this library expects (`<script setup
lang="ts">`, `:class` base-plus-consumer binding, `v-bind="$attrs"` for
fallthrough attributes, `<slot />` for children, `defineModel()` for
two-way binding, emitted events rather than callback props), the npm
package name and install command, and pointers into the framework-agnostic
naming and composition references. The skill itself is
[`SKILL.md`](SKILL.md); the `@AGENTS/*.md` files loaded above are the same
binding design-principle rules every other subproject in this repository
loads, so an agent explaining this library's usage is grounded in the same
rules the library's own components are held to.

## What this subproject is, and isn't

- **Is**: a distributable skill scoped to *consuming*
  `lily-design-system-vue-headless` from a Vue 3 application — install,
  import, class binding, attribute fallthrough, slots, `v-model`.
- **Isn't**: the Vue headless library itself (that's
  [`lily-design-system-vue-headless`](../lily-design-system-vue-headless/)
  — this subproject ships no components, no build, no tests beyond
  `bin/test`'s required-files checks).
- **Isn't**: the general, framework-agnostic Lily concepts skill (that's
  [`lily-design-system-skill`](../lily-design-system-skill/) — terminology,
  the catalog shape, naming conventions and composition patterns
  independent of any one framework's syntax).
- **Isn't**: the Vue helpers skill (that's
  [`lily-design-system-vue-helpers-skill`](../lily-design-system-vue-helpers-skill/)
  — the six `*-picker` packages, a separate npm catalog with its own
  icon-button-plus-listbox contract).

## Internationalization

Not applicable — this subproject ships no user-facing components or
strings; it is documentation for an AI coding agent.
