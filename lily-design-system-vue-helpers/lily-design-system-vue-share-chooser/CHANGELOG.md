# Changelog — ShareChooser (Vue)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-07-21

Renamed from `lily-design-system-vue-share-button`, alongside its three
sibling helpers. Nothing was ever published under the old name, so the
version stays at 0.1.0 and this entry replaces the previous one.

The rename is full-depth:

- Component and default export: `ShareChooser` -> `ShareChooser`.
- Class hooks: `.share-chooser*` -> `.share-chooser`,
  `.share-chooser-button`, `.share-chooser-icon`, `.share-chooser-list`,
  `.share-chooser-list-item`, `.share-chooser-target`,
  `.share-chooser-copy`, `.share-chooser-status`.
- Id helper: `nextShareChooserId` -> `nextShareChooserId`.

The emitted events -- `share`, `copy`, `nativeShare` -- are unchanged;
none of them said "button".

### Changed (BREAKING)

- **The trigger naming exception is gone.** The trigger was
  `.share-chooser-trigger` only because `.share-chooser-button` read
  badly. Under the new name that problem disappears, so the trigger is
  now **`.share-chooser-button`**, matching `theme-chooser`,
  `locale-chooser` and `text-size-chooser`. The documented exception has
  been removed from `spec/index.md` and `AGENTS.md`.

### The package as it stands

- Headless Vue 3 share control: a single-glyph button (U+27A4 RIGHTWARDS
  ARROW WITH HOOK) that opens the native share sheet where the browser
  has one, and otherwise discloses a list of consumer-supplied
  destinations plus an opt-in copy-the-URL action.
- Destinations are real `<a>` elements built by each target's
  `href(url, title, text)`; this package ships no third-party endpoints.
- Copy outcomes are announced in a polite live region via `copiedLabel`
  / `copyFailedLabel`.
- Owns an action, not a preference: no `v-model`, no `storageKey`,
  nothing written to the document.
- Exports `ShareChooser`, `canShareNatively`, `canCopy`,
  `nextShareChooserId`, `BLACK_RIGHTWARDS_ARROWHEAD`, and the `Props` /
  `SlotArgs` / `ChildArgs` / `ShareTarget` / `ShareStrategy` types.
- Ships no CSS, fonts, icons, or images. SSR-safe.

## Prior history — released in-tree as `lily-design-system-vue-share-button`

Everything below happened in-tree under the former name, and is
kept verbatim -- headings demoted one level, old names intact -- so
the record stays accurate. None of it was published to npm.

#### 0.1.0 — 2026-07-21

##### Added

- Initial release. A headless share control: a single-glyph button
  (➤, U+27A4) that opens the **native share sheet** via `navigator.share`
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
- Exports `canShareNatively`, `canCopy`, `nextShareChooserId`,
  `BLACK_RIGHTWARDS_ARROWHEAD`, and the types `Props`, `SlotArgs`,
  `ChildArgs`, `ShareTarget`, `ShareStrategy`.
- `ShareChooser.test.ts` — 35 vitest cases under jsdom +
  `@vue/test-utils`, one or more per numbered `spec/index.md` §7 clause.
- `docs/accessibility.md`, `examples/basic.vue`, and this file.

##### Notes

- Unlike the `*-select` helpers, this owns an *action*, not a preference:
  it applies nothing to the document and persists nothing. There is
  therefore no `v-model:value`, no `storageKey`, and no hidden input.
- The trigger's class hook is `share-chooser-trigger`, not
  `share-chooser-button` — the one deliberate bend in the
  `{helper}-button` convention, since `.share-chooser-button` reads badly.
- Behaviour differs by platform when `strategy="auto"`: a phone gets the
  OS sheet, a desktop gets the list. Documented in
  `docs/accessibility.md` rather than glossed.

##### Parity

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
  how `theme-chooser` and `text-size-chooser` name it.
- Rest props reach the root `<div>` via Vue's `$attrs` fall-through
  rather than an explicit spread.
- `queueMicrotask` before `.focus()` becomes `await nextTick()`, Vue's
  DOM-flush primitive.

##### Not a listbox, deliberately

The other three helpers in this catalog are WAI-ARIA APG listboxes
driven by `aria-activedescendant`. This one is a disclosure with real
focusable links, because its items are navigation. Harmonising it into
a listbox would reintroduce exactly the `role="menuitem"` costs the
Svelte spec §3 rejects.

---

Lily™ and Lily Design System™ are trademarks.
