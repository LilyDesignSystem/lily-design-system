# Lily Design System™ — Svelte Helpers Skill

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

- **Package**: lily-design-system-svelte-helpers-skill
- **Version**: 0.1.0
- **Created**: 2026-09-04
- **License**: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause or contact us for more
- **Contact**: Joel Parker Henderson (joel@joelparkerhenderson.com)

## Overview

A Claude Skill explaining the Svelte 5 `*-picker` helper catalog,
[`lily-design-system-svelte-helpers`](../lily-design-system-svelte-helpers/)
— the six helpers (theme-picker, locale-picker, text-size-picker,
motion-picker, share-picker, date-time-picker) and, per
`AGENTS/helpers.md`'s "Svelte is canonical" rule, **the reference
contract every other framework's helpers port from**. The skill itself is
[`SKILL.md`](SKILL.md); the `@AGENTS/*.md` files loaded above are the same
binding design-principle rules every other subproject in this repository
loads, plus `AGENTS/sveltekit.md` for the Svelte 5 + SvelteKit 2
conventions specific to this framework pair, so an agent explaining the
canonical helper contract is grounded in the same rules the Svelte
helpers catalog itself is held to.

## What this subproject is, and isn't

- **Is**: a distributable skill scoped to consuming and understanding
  `lily-design-system-svelte-helpers` — the six helpers' contracts, their
  npm package identities and install idiom, the icon-button-opens-listbox
  shape shared by the four preference helpers versus `share-picker`'s
  disclosure and `date-time-picker`'s field+dialog shape, and the
  idempotent-apply rule that exists because of a real, documented Svelte
  `$effect` re-entrancy defect (see `AGENTS/helpers.md`'s "Applying is
  idempotent" rule).
- **Isn't**: the Svelte helpers catalog itself (that's
  [`lily-design-system-svelte-helpers`](../lily-design-system-svelte-helpers/),
  which ships the six helper packages) — it ships no components of its
  own. Isn't the general, framework-agnostic Lily concepts skill (that's
  [`lily-design-system-skill`](../lily-design-system-skill/)). Isn't the
  Svelte headless-catalog skill (that's
  [`lily-design-system-svelte-headless-skill`](../lily-design-system-svelte-headless-skill/)),
  which covers the plain catalog components, not the picker helpers
  layer.

## Internationalization

Not applicable — this subproject ships no user-facing components or
strings; it is documentation for an AI coding agent.
