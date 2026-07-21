# AGENTS — ShareChooser (Vue helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first;
everything below is a fast index.

## What this package is

A Vue 3 headless share control. A single-glyph button (↪, U+21AA) that
uses the **native share sheet** when the browser has one, and otherwise
opens a disclosure list of consumer-supplied destinations plus a
built-in copy-the-URL action. Ships no CSS, no icons, and no
third-party endpoints.

A direct port of the canonical
[`lily-design-system-svelte-share-chooser`](../../lily-design-system-svelte-helpers/lily-design-system-svelte-share-chooser/).
When the two disagree, the Svelte side wins.

## Files

| File | Purpose |
| ---- | ------- |
| `spec/index.md` | Specification-driven contract (canonical). |
| `ShareChooser.vue` | Implementation. `<script setup lang="ts">`. |
| `ShareChooser.test.ts` | Vitest spec, mapped to the §7 clauses. |
| `index.ts` | Barrel re-export. |
| `index.md` | User guide. |
| `docs/accessibility.md` | Tradeoffs, stated plainly. |

## Public surface

- Default export: `ShareChooser` component.
- Named exports: `ShareChooser`, `canShareNatively`, `canCopy`,
  `nextShareChooserId`, `RIGHTWARDS_ARROW_WITH_HOOK`.
- Type exports: `Props`, `SlotArgs`, `ChildArgs` (alias of `SlotArgs`),
  `ShareTarget`, `ShareStrategy`.

Required prop: `label`.

## Behaviour contract (one paragraph)

Activating the button either opens the native sheet
(`navigator.share`, when `strategy` allows and it exists) or opens the
list. Destinations are real links built by each target's `href(url,
title, text)`. The copy item writes `url` to the clipboard, emits
`copy`, and announces `copiedLabel` / `copyFailedLabel` in a polite
live region. Nothing is applied to the document and nothing is
persisted — unlike the `*-chooser` preference helpers, this owns an
action, not a preference, so there is no `v-model` and no `storageKey`.

## HTML

`<div class="share-chooser">` → `<button class="share-chooser-button">`
with an `aria-hidden` glyph span → `<ul class="share-chooser-list" hidden>`
of `<li>` containing `<a class="share-chooser-target">` and an optional
`<button class="share-chooser-copy">` → `<p class="share-chooser-status"
aria-live="polite">`.

**Not a menu.** Destinations are real `<a>` elements; `role="menuitem"`
would strip middle-click, open-in-new-tab and copy-link-address. The
trigger class is `share-chooser-button`, following the same
`{helper}-button` convention as the other three helpers.

**Not a listbox either.** The three `*-chooser` preference helpers in
this catalog are APG listboxes driven by `aria-activedescendant`; this one moves
real focus between real focusable elements. Do not "harmonise" it into
a listbox.

## Events, not callback props

The Svelte canonical's `onShare` / `onCopy` / `onNativeShare` callback
props map to the `share` / `copy` / `nativeShare` emitted events, the
same way `onChange` maps to `@change` on the `*-chooser` preference
helpers. `nativeShare` is written `@native-share` in templates.

## Vue gotchas this package already handles

- `:hidden="open ? undefined : true"` and an explicit `'true'` /
  `'false'` ternary for `aria-expanded`. Vue 3.5 normalises raw
  booleans correctly for both, but the explicit forms match the
  siblings and state the intent.
- `await nextTick()` before `.focus()` in `openList` / `closeList`: a
  `hidden` element cannot take focus until the DOM has flushed. jsdom
  does not enforce this, so **no test guards it** — do not "simplify"
  it away.

## Conventions this package follows

- Vue 3 `<script setup lang="ts">` Composition API.
- `defineProps` + `withDefaults`, `defineEmits` for typed props/events.
- `ref`, `onMounted`, `onBeforeUnmount` for state and lifecycle.
- Strict TypeScript on the public surface.
- No runtime dependency beyond `vue`.
- No bundled CSS, fonts, icons, images, or third-party URLs.
- All user-facing strings come from props — including the copy label,
  which is why the copy item is opt-in.
