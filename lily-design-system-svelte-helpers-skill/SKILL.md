---
name: lily-design-system-svelte-helpers-skill
description: Explains Lily Design System's Svelte *-picker helper catalog — the canonical reference every other framework's helpers port from — covering the six helpers (theme-picker, locale-picker, text-size-picker, motion-picker, share-picker, date-time-picker), their npm package names and install idiom, the shared icon-button-opens-listbox contract for the four preference helpers versus share-picker's link disclosure and date-time-picker's field+dialog shape, and the idempotent-apply rule that exists because a re-entrant $effect once froze the picker mid-open. Use when someone asks how to install or use a Lily Svelte picker helper, wants the Svelte 5 idiom for one of the six helpers, asks why applying a preference must be idempotent, or asks which catalog is canonical when framework helpers disagree.
license: MIT OR Apache-2.0 OR GPL-2.0-only OR GPL-3.0-only OR BSD-3-Clause
---

# Lily Design System™ — Svelte helpers

The Svelte 5 implementation of Lily's `*-picker` helper catalog —
opinionated packages that each own one complete interaction end to end
(selection, DOM application, optional persistence), sitting above the
plain headless catalog. **This catalog is canonical**: per
`AGENTS/helpers.md`'s "Svelte is canonical" rule, every other framework's
helpers (React, Vue, Angular, Blazor, HTML, Nunjucks, Web Components) port
their contract from `lily-design-system-svelte-helpers`, and when a
catalog disagrees with Svelte, Svelte wins.

## The six helpers

| Helper | Owns | Root markup shape |
| --- | --- | --- |
| `theme-picker` | a **preference** (visual theme) | icon button (◑) + listbox |
| `locale-picker` | a **preference** (`lang`/`dir`) | icon button (🌐) + listbox |
| `text-size-picker` | a **preference** (`data-text-size`) | icon button ("A") + listbox |
| `motion-picker` | a **preference** (`data-motion`) | icon button (⏸) + listbox |
| `share-picker` | an **action** | icon button (➤) + disclosure of real `<a>` links |
| `date-time-picker` | a **form value** | typeable text field + icon button (📅) opening an APG dialog |

The four preference helpers share one contract: root
`<div class="{helper} {class}">` containing a hidden input for form
participation, a `<button class="{helper}-button" aria-haspopup="listbox"
aria-expanded aria-controls>` whose only content is an `aria-hidden`
glyph span, and a `<ul class="{helper}-list" role="listbox" hidden>` of
`<li role="option" aria-selected>` — the WAI-ARIA APG listbox keyboard
pattern throughout (arrows clamp, Home/End jump, typeahead, Enter/Space
select-apply-and-close, Escape reverts, Tab closes and moves on).
`share-picker` deliberately breaks that shape: its destinations are
navigation, so they're real `<a>` elements in a disclosure, not
`role="option"` items — `role="menuitem"` would strip middle-click and
open-in-new-tab. `date-time-picker` breaks it differently: it's a form
control, not a page-header control, so it pairs a typeable field with its
trigger rather than being icon-button-only. `motion-picker`'s one
divergence from its three preference siblings: its default checks
`(prefers-reduced-motion: reduce)` unconditionally rather than resolving
to a fixed slug, because motion has a real accessibility signal (WCAG
2.3.3) worth deferring to.

Full per-helper contracts: `AGENTS/helpers.md` (loaded into this skill's
`AGENTS.md`) and each helper's own `spec/index.md` under
`../lily-design-system-svelte-helpers/`.

## Install

Each helper is published as its own npm package. As verified against the
live registry: `lily-design-system-svelte-theme-picker`,
`-locale-picker`, `-text-size-picker`, `-share-picker`, and
`-date-time-picker` are published (0.1.1); `-motion-picker` was not found
on the registry as of this writing — check `npm view
lily-design-system-svelte-motion-picker version` for current status
before depending on it via npm rather than a workspace/folder import.

```sh
pnpm add lily-design-system-svelte-theme-picker
```

```svelte
<script lang="ts">
  import { ThemePicker } from "lily-design-system-svelte-theme-picker";
</script>
```

Every helper's own `peerDependencies` requires `svelte` `^5.0.0` only —
no other runtime dependency.

## The idempotent-apply rule

Applying an already-applied preference must be a no-op: no DOM write, no
`localStorage` write, no change callback. This matters more in Svelte
than it sounds: a `$effect` re-runs on every dependency change, not only
on a real value change, and firing the consumer's change callback each
time invites the consumer to write state back into the same effect's
dependencies — which loops straight back in. Unguarded, that loop ends in
Svelte's own `effect_update_depth_exceeded`: the component stops updating
its DOM entirely, and the picker freezes mid-open with a stale
`aria-expanded="true"` over a hidden listbox — a symptom that looks
nothing like "re-entrant apply" to whoever hits it first. The callback
contract is once per applied change, and the idempotency guard is what
makes that true. See `AGENTS/helpers.md`'s "Applying is idempotent" rule
for the full explanation, including how the other frameworks each reach
the apply step more often than the value changes for their own
framework-specific reasons.

## Svelte 5 idiom

Same runes-based shape as the headless catalog (`class` prop, `$props()`
with rest-props, `$bindable()`, `Snippet` children, no `<style>` blocks)
— see `lily-design-system-svelte-headless-skill` for the idiom itself,
and `AGENTS/sveltekit.md` for the general Svelte 5 + SvelteKit 2
conventions this repository follows.

## When NOT this skill

- For the plain headless catalog components (not the picker helpers), use
  `lily-design-system-svelte-headless-skill`.
- For framework-agnostic Lily concepts, terminology, and naming/composition
  patterns that apply across all seven frameworks, use
  `lily-design-system-skill`.
