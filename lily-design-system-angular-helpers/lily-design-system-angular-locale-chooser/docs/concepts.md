# Concepts

How `LocaleChooser` thinks about locale, where it sits in your
stack, and what it deliberately leaves to you.

## Three orthogonal concerns

A web app changes language across three independent axes:

| Axis                       | What changes                                                            | Owner                                                              |
| -------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------ |
| **Document language**      | The `lang` attribute on `<html>`. Screen readers, search engines, hyphenation, font selection. | `LocaleChooser` (this helper).                                      |
| **Writing direction**      | The `dir` attribute on `<html>`. Bidi text, scrollbar position, flex/grid mirror. | `LocaleChooser` (auto-detected from the locale; opt out with `[applyDir]="false"`). |
| **Translated strings**     | The actual visible words on the page.                                   | Your i18n library (`@angular/localize`, Transloco, ngx-translate, raw `Intl`). |

The helper owns the first two and signals the third via a bindable
`value` (via `[(value)]`), a `localeChange` output, and the `lang`
attribute (which most i18n libraries don't read directly — they
react to the bindable).

The split matters because it lets you swap your i18n library
without rewriting the select, and it lets the select stay
headless: zero CSS, zero string tables, zero dependencies beyond
Angular.

## What "headless" means here

The select:

- Renders semantic HTML (`<button>` + `<ul>` + `<li>`) wired up as a
  WAI-ARIA APG listbox: roles, `aria-expanded`, `aria-selected`,
  `aria-activedescendant`, and the full keyboard contract.
- Carries stable kebab-case class hooks (`locale-chooser` on the root
  `<div>`, plus `locale-chooser-button`, `locale-chooser-icon`,
  `locale-chooser-list`, `locale-chooser-option`) so your CSS can target
  it without prefixes or specificity tricks.
- Ships **no** colour, spacing, typography, font, icon, or
  animation decisions. You supply all of that — including the
  positioning that makes the list overlay the page rather than push
  it down.
- Ships **no** translated strings. The `label` input and
  `localeLabels` input are passed through verbatim.

The one visual thing it does ship is the default glyph, U+1F310 GLOBE
WITH MERIDIANS — a character, not an asset, and replaceable by
projecting an `<ng-template>`.

## The lifecycle

Each instance manages a single bindable `value`:

```
       ┌──────────────────────────────────────────────────┐
       │   effect() run 1 — resolves once                  │
       │                                                   │
   value (consumer) ─── if empty ───► storage ──► navigator ──► defaultValue ──► "en" ──► locales[0]
       │                                                   │
       │  writes back via this.value.set(resolved)         │
       └──────────────────────────────────────────────────┘
                       │
                       ▼
       ┌──────────────────────────────────────────────────┐
       │   effect() runs on every value() change           │
       │                                                   │
       │   target.lang = BCP-47(value)                     │
       │   target.dir  = rtl|ltr                           │
       │   localStorage.setItem(...)                       │
       │   localeChange.emit(value)                        │
       └──────────────────────────────────────────────────┘
```

Both DOM mutation and storage are side effects, so they belong in
the `effect()` callback, not in pure derived signals.

## Why an icon button and a custom listbox

Three reasons:

1. **Compact and fully styleable**. The trigger is one glyph wide
   whatever the locale list contains, and every part of the open list
   is a plain element you can style. A native `<select>` is neither —
   its width follows its content and its popup is the platform's.
2. **Symmetry with `ThemeChooser`**. The sibling helper in this
   directory uses the same shape, so the two compose visually and
   semantically without surprises.
3. **Escape hatch is one signal away**. The bindable `value`
   exposes the state machine; building a radio group, a button
   group, or a native `<select>` that writes to the same signal is a
   10-line sibling widget, not a fork.

Be clear about the cost. A native `<select>` gets platform-native
keyboard handling, OS pickers on mobile, and reliable value
announcement for free; a custom listbox reimplements all of it and is
supported less consistently by assistive technology. That is a real
regression, spelled out in
[docs/accessibility.md](./accessibility.md). If your audience makes it
the wrong trade, reason 3 is the answer — see
[examples/sibling-select.component.ts](../examples/sibling-select.component.ts).

For an always-visible list of a few locales, use a sibling widget
to render radios or buttons. See
[examples/sibling-buttons.component.ts](../examples/sibling-buttons.component.ts).

## Why a separate `value` and `target.lang`

The bindable `value` is in **consumer form** — whatever you put
into `locales` (`en_US` or `en-US` or `en`). It round-trips
losslessly.

The `target.lang` attribute is in **BCP 47 form** — always hyphens
(`en-US`). This is what `<html>` and the HTML spec require.

Keeping them separate means:

- Your existing locale store (CLDR-style `en_US`) stays untouched.
- `<html lang>` is spec-compliant without consumer code touching
  the conversion.
- Two-way `[(value)]` Just Works.

## Where storage fits in

`storageKey` is optional and opt-in. When set:

- Selection writes synchronously to `localStorage`.
- On a fresh mount with no `value` input, the stored value is
  read back.
- Storage errors (private mode, quota) are swallowed silently;
  the select degrades to the default.

If you have a server (Analog, Universal, Astro SSR, etc.), prefer
a cookie instead — it survives the round-trip and avoids a flash
of default locale on first paint. Pass the cookie value as the
initial `value` input via an `InjectionToken` factory. See
[docs/ssr.md](./ssr.md).

## Where navigator detection fits in

`detectFromNavigator` is opt-in. When set, the first effect run
inspects `navigator.languages` and picks the first entry whose
language matches something in your `locales` array. The match
algorithm is simple (exact first, language-only second) — not
RFC 4647 best-fit. If you need stronger negotiation, run your own
resolver and pass the result as `value`.

## How to test it

Three layers, mirroring the lifecycle:

1. **Pure helpers** — `bcp47LocaleTag`, `isRtlLocale`,
   `localeName`, `matchNavigatorLanguage` are pure functions.
   Unit-test them in isolation.
2. **DOM contract** — after mount, assert
   `document.documentElement.lang` and `.dir`. Click the button to
   open the list, click an option, and assert again.
3. **Keyboard contract** — dispatch bubbling `keydown` events at the
   button and the `<ul>`, and assert on `aria-expanded`,
   `aria-activedescendant`, and `document.activeElement`.
4. **Bindable + change event** — drive `value` programmatically
   via `componentRef.setInput("value", ...)` and assert the same
   DOM observations; assert that `localeChange` was emitted.

See [../locale-chooser.component.spec.ts](../locale-chooser.component.spec.ts)
for the reference suite that covers every `spec/index.md` §7 acceptance
item.

## Angular-specific notes

### `model()` vs explicit `input()` + `output()`

The select uses `model<string>("")` for the bindable so it can
suppress the bind-back during initial-value resolution (when the
resolved value matches the supplied value — guarded by the
`initialised` flag). A plain `input()` + `output()` pair would
work but force the consumer to wire `[value]` and
`(valueChange)` separately. `model()` gives the same ergonomics
as Vue's `v-model` and Svelte's `bind:`.

### `[(value)]` vs separate `[value]` + `(valueChange)`

The select exposes its bindable on `value`. Always use
`[(value)]="locale"`. This matches the Svelte canonical's
`bind:value` semantics and keeps the API symmetric across
frameworks.

If you only need one-way data flow, use `[value]="locale"` and
listen to `(localeChange)` separately for side effects (cookie
writes, i18n library calls).

### Why no `@HostBinding('attr.lang')`

A future variant could write `lang` via a host binding so the
attribute lives on the `<lily-locale-chooser>` element rather than
on `document.documentElement`. The current `LocaleChooser` writes
to the document root because:

- `<html lang>` is what every search-engine, screen-reader, and
  CSS `:lang()` selector reads.
- The document-root write composes with SSR cookie bridges that
  set `<html lang>` server-side.
- Per-region locale scoping is still possible via the `target`
  input.

---

Lily™ and Lily Design System™ are trademarks.
