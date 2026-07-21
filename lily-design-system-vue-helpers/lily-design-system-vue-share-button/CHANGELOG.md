# Changelog — ShareButton (Vue)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-07-21

### Added

- Initial release. A headless share control: a single-glyph button
  (↪, U+21AA) that opens the **native share sheet** via `navigator.share`
  where the browser provides one, and otherwise a disclosure list of
  consumer-supplied destinations plus a built-in copy-the-URL action.
- `targets` are supplied by the consumer, each with its own `href(url,
  title, text)` function. **No social-network endpoints ship with this
  package** — which networks belong in a product is an editorial and
  privacy decision, the URLs change, and networks die.
- Destinations render as real `<a>` elements rather than
  `role="menuitem"`, preserving middle-click, open-in-new-tab and
  copy-link-address. Copy is a real `<button>`.
- Copy outcome is announced in an `aria-live="polite"` region.
  `copyLabel`, `copiedLabel` and `copyFailedLabel` are all props — the
  copy item renders only when named, since a default label would be a
  hardcoded English string.
- Keyboard: arrows move between items and clamp, Home/End jump, Escape
  closes and returns focus to the trigger, Tab closes and moves on.
- Exports `canShareNatively`, `canCopy`, `nextShareButtonId`,
  `RIGHTWARDS_ARROW_WITH_HOOK`, and the types `Props`, `SlotArgs`,
  `ChildArgs`, `ShareTarget`, `ShareStrategy`.
- `ShareButton.test.ts` — 35 vitest cases under jsdom +
  `@vue/test-utils`, one or more per numbered `spec/index.md` §7 clause.
- `docs/accessibility.md`, `examples/basic.vue`, and this file.

### Notes

- Unlike the `*-select` helpers, this owns an *action*, not a preference:
  it applies nothing to the document and persists nothing. There is
  therefore no `v-model:value`, no `storageKey`, and no hidden input.
- The trigger's class hook is `share-button-trigger`, not
  `share-button-button` — the one deliberate bend in the
  `{helper}-button` convention, since `.share-button-button` reads badly.
- Behaviour differs by platform when `strategy="auto"`: a phone gets the
  OS sheet, a desktop gets the list. Documented in
  `docs/accessibility.md` rather than glossed.

### Parity

A direct port of the Svelte canonical
`lily-design-system-svelte-share-button` v0.1.0, with the §7 clause
numbering kept identical so the two suites cross-reference.

Framework deviations, all idiomatic rather than behavioural:

- The `onShare` / `onCopy` / `onNativeShare` callback props map to the
  `share` / `copy` / `nativeShare` **emitted events**, the same way
  `onChange` maps to `@change` on the `*-select` helpers. In templates:
  `@share`, `@copy`, `@native-share`.
- The `children` snippet maps to the **default scoped slot**, and the
  `ChildArgs` type is aliased as `SlotArgs` (both are exported), matching
  how `theme-select` and `text-size-select` name it.
- Rest props reach the root `<div>` via Vue's `$attrs` fall-through
  rather than an explicit spread.
- `queueMicrotask` before `.focus()` becomes `await nextTick()`, Vue's
  DOM-flush primitive.

### Not a listbox, deliberately

The other three helpers in this catalog are WAI-ARIA APG listboxes
driven by `aria-activedescendant`. This one is a disclosure with real
focusable links, because its items are navigation. Harmonising it into
a listbox would reintroduce exactly the `role="menuitem"` costs the
Svelte spec §3 rejects.

---

Lily™ and Lily Design System™ are trademarks.
