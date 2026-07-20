# Concepts

How `LocaleSelect` thinks about locale, where it sits in your
stack, and what it deliberately leaves to you.

## Three orthogonal concerns

A web app changes language across three independent axes:

| Axis                       | What changes                                               | Owner                                  |
| -------------------------- | ---------------------------------------------------------- | -------------------------------------- |
| **Document language**      | The `lang` attribute on `<html>`. Screen readers, search engines, hyphenation, font selection. | `LocaleSelect` (this helper).        |
| **Writing direction**      | The `dir` attribute on `<html>`. Bidi text, scrollbar position, flexbox/grid mirror. | `LocaleSelect` (auto-detected from the locale; opt out with `ApplyDir="false"`). |
| **Translated strings**     | The actual visible words on the page.                      | Your i18n library (`IStringLocalizer<T>`, ResX, custom `CultureInfo` switching, third-party). |

The helper owns the first two and signals the third via a bindable
`Value` (via `@bind-Value`), an `OnChange` event, and the `lang`
attribute (which `IStringLocalizer<T>` doesn't read directly — it
reads `CultureInfo.CurrentUICulture`, which you set in `OnChange`).

The split matters because it lets you swap your i18n library
without rewriting the select, and it lets the select stay
headless: zero CSS, zero string tables, zero dependencies beyond
the Blazor framework.

## What "headless" means here

The select:

- Renders a semantic trigger `<button type="button">` plus a
  `<ul role="listbox">` of `<li role="option">` entries, following
  the WAI-ARIA APG listbox pattern, with a hidden `<input>` for
  form participation.
- Carries a stable kebab-case class hook (`locale-select`,
  `locale-select-button`, `locale-select-icon`,
  `locale-select-list`, `locale-select-option`) on every element so
  your CSS can target it without prefixes or specificity tricks.
- Ships **no** colour, spacing, typography, font, icon, or
  animation decisions. You supply all of that.
- Ships **no** translated strings. The `Label` parameter and
  `LocaleLabels` parameter are passed through verbatim.

## The lifecycle

Each instance manages a single bindable `Value`:

```
       ┌───────────────────────────────────────────┐
       │   OnAfterRenderAsync(true) — resolves once │
       │                                            │
   Value (consumer) ─── if empty ───► storage ──► navigator ──► DefaultValue ──► "en" ──► Locales[0]
       │                                            │
       │  writes back via ValueChanged              │
       └───────────────────────────────────────────┘
                       │
                       ▼
       ┌───────────────────────────────────────────┐
       │   Value change — every value mutation      │
       │                                            │
       │   <html lang> = BCP-47(Value)              │
       │   <html dir>  = rtl|ltr (if ApplyDir)      │
       │   localStorage.setItem(...)                │
       │   OnChange.InvokeAsync(Value)              │
       └───────────────────────────────────────────┘
```

Both DOM mutation and storage are side effects, so they belong in
`OnAfterRenderAsync` / `SetLocaleAsync`, not in property setters.

## Why an icon button plus a listbox by default

Three reasons:

1. **Scales to long lists**. The trigger is one glyph-sized button
   regardless of how many locales you support, where a radio group
   grows linearly and dominates the layout past a handful of
   options.
2. **Symmetry with `ThemeSelect`**. The sibling helper in this
   catalog uses the same shape, so the two compose visually and
   semantically without surprises.
3. **Real DOM options**. Each `<li role="option">` is an ordinary
   element you can style and that carries its own `lang`, which a
   native `<select>` popup could not reliably give us.

If you want a different control shape entirely — a button group, a
row of flags — drive the component from your own markup: take a
`@ref` and call `SetLocaleAsync(code)`. `ChildContent` is a
narrower tool: it replaces the glyph inside the trigger button and
does not render options.

## Why a separate `Value` and `lang` attribute

The bindable `Value` is in **consumer form** — whatever you put
into `Locales` (`en_US` or `en-US` or `en`). It round-trips
losslessly.

The `lang` attribute is in **BCP 47 form** — always hyphens
(`en-US`). This is what `<html>` and the HTML spec require.

Keeping them separate means:

- Your existing locale store (CLDR-style `en_US`) stays untouched.
- `<html lang>` is spec-compliant without consumer code touching
  the conversion.
- Two-way `@bind-Value` Just Works.

## Where storage fits in

`StorageKey` is optional and opt-in. When set:

- Selection writes synchronously to `localStorage`.
- On a fresh interactive mount with no `Value`, the stored value
  is read back.
- Storage errors (private mode, quota) are swallowed silently;
  the select degrades to the default.

If you have a server (Blazor Server, Blazor Web App), prefer a
cookie instead — it survives the round-trip and avoids a flash of
default locale on first paint. Pass the cookie value as the
initial `Value` parameter. See [docs/ssr.md](./ssr.md).

## Where navigator detection fits in

`DetectFromNavigator` is opt-in. When set, the first mount
inspects `navigator.languages` and picks the first entry whose
language matches something in your `Locales` array. The match
algorithm is simple (exact first, language-only second) — not
RFC 4647 best-fit. If you need stronger negotiation, run your own
resolver and pass the result as `Value`.

## How to test it

Three layers, mirroring the lifecycle:

1. **Pure helpers** — `Locales.Bcp47LocaleTag`,
   `Locales.IsRtlLocale`, `Locales.LocaleName`,
   `Locales.MatchNavigatorLanguage` are pure functions.
   Unit-test them in isolation with plain xUnit.
2. **DOM contract** — after mount, inspect
   `JSInterop.Invocations` for the `eval` call that sets `lang`
   and `dir`. Click the trigger button, click an
   `<li role="option">`, and inspect again.
3. **Bindable + OnChange** — drive `Value` programmatically
   and assert the same DOM observations; assert that `OnChange`
   was invoked.

See [../LocaleSelectTests.cs](../LocaleSelectTests.cs) for the
reference suite that covers every `spec/index.md` §7 acceptance item.

## Blazor-specific notes

### `@bind-Value` vs `Value`

The select exposes its bindable on `Value`. Always use
`@bind-Value="locale"` — that's sugar for `Value=` +
`ValueChanged=` and keeps the two-way contract intact.

### `RenderFragment<TContext>` vs separate component

The `<TContext>` parameter is the Blazor pattern for "render-prop"
or "scoped slot". It gives the consumer:

- A strongly-typed context (`LocaleSelectContext` with `Value`,
  `Open`, `LabelFor`).
- A single render-tree node owned by the select.
- Predictable lifetime — the fragment renders when the select
  renders.

The pure helpers the context used to carry (`TagFor`, `IsRtl`) live
on the static `Locales` class — `Locales.Bcp47LocaleTag(code)` and
`Locales.IsRtlLocale(code)` — so you can call them from anywhere,
including server-side code.

### Static helpers vs an interface

The `Locales` static class is the right pattern for pure helpers
that the select uses internally and that consumers may want to
call from server-side code or other components. An interface
(`ILocaleNormaliser`) would be over-engineered: there's no
substitutability scenario.

---

Lily™ and Lily Design System™ are trademarks.
