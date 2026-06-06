# Concepts

How `LocalePicker` thinks about locale, where it sits in your
stack, and what it deliberately leaves to you.

## Three orthogonal concerns

A web app changes language across three independent axes:

| Axis                       | What changes                                                            | Owner                                                              |
| -------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------ |
| **Document language**      | The `lang` attribute on `<html>`. Screen readers, search engines, hyphenation, font selection. | `LocalePicker` (this helper).                                      |
| **Writing direction**      | The `dir` attribute on `<html>`. Bidi text, scrollbar position, flex/grid mirror. | `LocalePicker` (auto-detected from the locale; opt out with `[applyDir]="false"`). |
| **Translated strings**     | The actual visible words on the page.                                   | Your i18n library (`@angular/localize`, Transloco, ngx-translate, raw `Intl`). |

The helper owns the first two and signals the third via a bindable
`value` (via `[(value)]`), a `localeChange` output, and the `lang`
attribute (which most i18n libraries don't read directly — they
react to the bindable).

The split matters because it lets you swap your i18n library
without rewriting the picker, and it lets the picker stay
headless: zero CSS, zero string tables, zero dependencies beyond
Angular.

## What "headless" means here

The picker:

- Renders semantic HTML (`<fieldset>` + `<input type="radio">`)
  with exactly the ARIA the WAI-ARIA APG specifies for a radio
  group.
- Carries a stable kebab-case class hook (`locale-picker`,
  `locale-picker-option`, `locale-picker-option-label`) on every
  element so your CSS can target it without prefixes or
  specificity tricks.
- Ships **no** colour, spacing, typography, font, icon, or
  animation decisions. You supply all of that.
- Ships **no** translated strings. The `label` input and
  `localeLabels` input are passed through verbatim.

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

## Why `<fieldset role="radiogroup">` by default

Three reasons:

1. **Discoverability**. The full set of options surfaces to
   assistive tech on first focus into the group, while a
   `<select>` requires the user to open the popover before the
   choices are announced.
2. **Symmetry with `ThemePicker`**. The sibling helper in this
   directory uses the same shape, so the two compose visually and
   semantically without surprises.
3. **Escape hatch is one signal away**. The bindable `value`
   exposes the state machine; building a `<select>` or button
   group that writes to the same signal is a 10-line sibling
   widget, not a fork.

For long locale lists (>~12), use a sibling `<select>` bound to the
same `[(value)]` signal. See
[examples/02-select.component.ts](../examples/02-select.component.ts).

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
  the picker degrades to the default.

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
   `document.documentElement.lang` and `.dir`. Drive a `dispatchEvent("change")`
   on a radio and assert again.
3. **Bindable + change event** — drive `value` programmatically
   via `componentRef.setInput("value", ...)` and assert the same
   DOM observations; assert that `localeChange` was emitted.

See [../locale-picker.component.spec.ts](../locale-picker.component.spec.ts)
for the reference suite that covers every `spec.md` §7 acceptance
item.

## Angular-specific notes

### `model()` vs explicit `input()` + `output()`

The picker uses `model<string>("")` for the bindable so it can
suppress the bind-back during initial-value resolution (when the
resolved value matches the supplied value — guarded by the
`initialised` flag). A plain `input()` + `output()` pair would
work but force the consumer to wire `[value]` and
`(valueChange)` separately. `model()` gives the same ergonomics
as Vue's `v-model` and Svelte's `bind:`.

### `[(value)]` vs separate `[value]` + `(valueChange)`

The picker exposes its bindable on `value`. Always use
`[(value)]="locale"`. This matches the Svelte canonical's
`bind:value` semantics and keeps the API symmetric across
frameworks.

If you only need one-way data flow, use `[value]="locale"` and
listen to `(localeChange)` separately for side effects (cookie
writes, i18n library calls).

### Why no `@HostBinding('attr.lang')`

A future variant could write `lang` via a host binding so the
attribute lives on the `<lily-locale-picker>` element rather than
on `document.documentElement`. The current `LocalePicker` writes
to the document root because:

- `<html lang>` is what every search-engine, screen-reader, and
  CSS `:lang()` selector reads.
- The document-root write composes with SSR cookie bridges that
  set `<html lang>` server-side.
- Per-region locale scoping is still possible via the `target`
  input.
