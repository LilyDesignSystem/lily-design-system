# Changelog — @lilydesignsystem/angular-headless

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the package follows [Semantic Versioning](https://semver.org/).
The canonical monorepo history is in the root
[CHANGELOG.md](https://github.com/LilyDesignSystem/lily-design-system/blob/main/CHANGELOG.md).

## 0.2.0 — 2026-09-21

**`Listbox` and `IconButton` extended, additively, so the `*-helpers`
catalog's picker components can compose them instead of hand-rolling
equivalent markup/keyboard logic — porting the same refactor already
done for the Svelte catalog.** Both components had zero real consumers
elsewhere in this catalog before the change (confirmed by search) —
full suite (1027 tests) stays green.

- `IconButton` and `Listbox` gain `baseClass` (defaults `"icon-button"`
  / `"listbox"`, unchanged) replacing the hardcoded prefix outright
  instead of appending to it, plus a public `focus(options?)` method
  (Angular CDK's `FocusableOption` idiom) so a composing consumer can
  focus the real rendered element — neither component previously
  exposed any way to do that. `IconButton` also gains a public `element`
  getter (the real `<button>` itself) for a consumer that needs the raw
  node rather than just a focus action — e.g. `date-time-picker`
  remembering it as a focus-restoration target and doing an
  `instanceof HTMLElement` check against it. Both components' selector host tag
  (`<lily-icon-button>` / `<lily-listbox>`) is now unconditionally
  `display: contents` (via `host: { style: ... }`): Angular's component
  model always emits a real host element for its own selector, unlike
  Svelte's no-wrapper-root option, so composing either inside another
  component's template would otherwise insert a visible extra box
  between that component's root and the real `<button>`/`<div>` —
  the same "structurally required inline style" exception already
  documented for `ThemeProvider` in spec/headless/index.md.
- `Listbox` gains an opt-in `navigation="active-descendant"` input
  (default remains `"roving-focus"`, which was — and remains —
  entirely inert: this component shipped with no keyboard handling of
  any kind, so there was no existing behaviour to preserve beyond "does
  nothing"). Implements the full WAI-ARIA APG listbox keyboard
  contract via a virtual cursor: two-way `activeIndex` (a `model()`
  signal, this catalog's established bindable-state idiom — see
  `picker-bar`'s own contract note), mirrored to `aria-activedescendant`,
  plus `clamp` (vs. wrap), `typeahead`, `pageSize` paging, and
  `activate`/`escape`/`tabOut` outputs.
- `aria-haspopup`/`aria-expanded`/`aria-controls`/`disabled` added to
  `IconButton` as named inputs (Angular has no generic
  spread-onto-inputs mechanism — see `picker-bar`'s own note on the
  same constraint — so these are explicit rather than a rest-prop
  spread); click/keydown wiring needs no new API at all, since a
  native `(click)`/`(keydown)` binding on `<lily-icon-button>` already
  catches events bubbling up from the real inner `<button>`.

## 0.1.0 — 2026-09-16

**Package renamed: `lily-design-system-angular-headless` → `@lilydesignsystem/angular-headless`.** npm scoped packages
are registry-distinct from their unscoped counterparts, so this is a
new package with no publish history of its own — version reset to
`0.1.0` per this project's established rename precedent (the July
2026 `*-select` → `*-picker` rename). No code or behaviour change
relative to `lily-design-system-angular-headless`'s last published version (`0.1.0`);
its full changelog continues below, now read as history prior to the
rescope. The old unscoped name is deprecated on the registry (never
unpublished), pointing consumers here.

---

## 0.2.0 — 2026-08-26

Angular 22 support. Built and verified on Angular 22.1 (ng-packagr
22.1, TypeScript 6.0, vitest 4, jsdom 30, Storybook 10); the peer
range widens to `>=20.0.0 <23.0.0`, so Angular 20 and 21 consumers are
unaffected. All 1,010 spec cases and the 491-story Storybook build
pass on the new toolchain. No component behaviour change.

## 0.1.1 — 2026-08-26

Fixed: **every typed input component rendered `type="text"`** — all 25
of them (radio, checkbox, date, email, file, password, range, tel, url,
week, and the rest), a generator artifact that survived because no spec
asserted an input's type. Radio buttons were text boxes to the browser
and to assistive technology. Each of the 25 now renders its canonical
type from `components/{slug}/AGENTS.md`, each spec asserts it (the new
assertions were seeded-fault-checked), and the suite grows 985 → 1,010
cases. Found via an axe `target-size` finding on the Angular example
app's settings page, whose "radios" were undersized text inputs.

## 0.1.0 — 2026-08-26

First published release: the Angular 20 headless component library (standalone, signal-based, OnPush),
covering all 491 catalog components with per-component tests.

Numbered 0.1.0 deliberately. In-tree version numbers existed before
this release, but nothing was ever published under this name, and a
first release numbered higher would imply registry history that never
existed — the same reasoning the helper packages recorded at their
July 2026 reset. Sibling packages (svelte, react, vue) are on their
own version lines.
