# Lily Design System™ — Svelte Headless Skill

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
@AGENTS/sveltekit.md

## Metadata

- **Package**: lily-design-system-svelte-headless-skill
- **Version**: 0.1.0
- **Created**: 2026-09-04
- **License**: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause or contact us for more
- **Contact**: Joel Parker Henderson (joel@joelparkerhenderson.com)

## Overview

A Claude Skill explaining how to install and consume the Svelte 5
implementation of Lily Design System's headless component catalog,
[`lily-design-system-svelte-headless`](../lily-design-system-svelte-headless/)
(published to npm, 491 components). The skill itself is
[`SKILL.md`](SKILL.md); the `@AGENTS/*.md` files loaded above are the same
binding design-principle rules every other subproject in this repository
loads, plus `AGENTS/sveltekit.md` for the Svelte 5 + SvelteKit 2
conventions specific to this framework pair, so an agent explaining
Svelte-specific consumption is grounded in the same rules the Svelte
headless library itself is held to.

## What this subproject is, and isn't

- **Is**: a distributable skill scoped to consuming
  `lily-design-system-svelte-headless` from Svelte 5 — the npm package
  identity, the runes-based prop/rest-props/bindable idiom a consumer
  writes against, and pointers into the catalog-wide naming and
  composition rules.
- **Isn't**: the Svelte headless library itself (that's
  [`lily-design-system-svelte-headless`](../lily-design-system-svelte-headless/),
  which ships the components) — it ships no components of its own.
  Isn't the general, framework-agnostic Lily concepts skill (that's
  [`lily-design-system-skill`](../lily-design-system-skill/)). Isn't the
  Svelte `*-picker` helpers skill (that's
  [`lily-design-system-svelte-helpers-skill`](../lily-design-system-svelte-helpers-skill/)),
  which covers a different layer — opinionated packages that own a whole
  interaction rather than plain catalog components.

## Internationalization

Not applicable — this subproject ships no user-facing components or
strings; it is documentation for an AI coding agent.
