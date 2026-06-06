# LocalePicker — Specification (Blazor)

Single source of truth for the
`lily-design-system-blazor-locale-picker` Blazor helper. This file
drives implementation, testing, and documentation in the
spec-driven-development style: anything not in this spec is out of
scope; anything in this spec must be exercised by a test.

Sibling files in this directory:

- `LocalePicker.razor` — Razor markup
- `LocalePicker.razor.cs` — C# code-behind (partial class)
- `LocalePickerTests.cs` — bUnit + xUnit spec exercising every clause in §4–§7
- `Locales.cs` — built-in locale-code → English-name table, RTL sets, and pure helpers (port of `locales.ts`)
- `locales.tsv` — canonical 436-row list of locale codes and English names (verbatim copy of the Svelte canonical)
- `index.md` — user-facing readme

The Blazor headless library does not (yet) include a canonical
`LocalePicker`; this helper is the opinionated, reusable counterpart
that owns the locale-application lifecycle (the `lang` and `dir`
attributes on the document root) and the persistence choice.

---

## 1. Goal

Give a Blazor application a drop-in, headless locale picker that:

1. Renders an accessible radio group of available locales.
2. **Applies the chosen locale** by setting `lang="…"` and `dir="ltr|rtl"`
   on the document root (or on a consumer-supplied target).
3. Auto-detects script direction: RTL for locales using Arabic,
   Hebrew, Thaana, Mongolian (traditional), N'Ko, Syriac, or Adlam
   scripts.
4. Optionally persists the chosen locale to `localStorage` so the
   choice survives reload.
5. Optionally falls back to `navigator.language` on first visit when
   no value, storage entry, or default is supplied.
6. Ships zero CSS — the consumer styles every visual aspect via the
   `locale-picker` class hook and the `lang` / `dir` attributes.
7. Provides BCP 47-compliant tag output. Underscores in locale codes
   (e.g. `en_US`) are converted to hyphens (`en-US`) when written to
   the `lang` attribute, per RFC 5646.

## 2. Non-goals

- **Translation**. This component does not translate strings. It only
  signals the locale to the consumer's i18n library
  (`Microsoft.Extensions.Localization`, custom `IStringLocalizer`,
  Blazor `CultureInfo` switching) via the `lang` attribute, the
  `OnChange` callback, and the bindable `Value`.
- **Locale negotiation**. The component does not implement
  `LocaleMatcher` / RFC 4647 best-fit / lookup. The consumer is
  expected to pass a list of locales they already support, and the
  optional `navigator.language` fallback uses a simple prefix match.
- **Auto-discovery**. The consumer always supplies the list of
  available locale codes.
- **Bundling translation files**. No JSON / RESX assets ship with
  this helper.
- **A `<select>` default rendering**. The default is
  `<fieldset role="radiogroup">` for symmetry with `ThemePicker`.

## 3. Architectural decisions

- **The `lang` attribute is the source of truth**. Every i18n
  library agrees that `document.documentElement.lang` is the
  authoritative signal for current document language (WCAG 3.1.1).
- **The `dir` attribute is the secondary switch**. Setting `dir` on
  the document root mirrors layout, scrollbars, and bidi text.
- **BCP 47 hyphen form on the wire**. Locale codes are stored in the
  consumer's array using whichever form they prefer (`en_US`,
  `en-US`, or `en`). When the picker writes to the DOM, it normalises
  to the BCP 47 hyphen form (`en-US`). The bindable `Value` mirrors
  back the original consumer form, so round-trips are lossless.
- **`IJSRuntime` for all DOM writes.** The `lang` and `dir`
  attributes are set via `IJSRuntime.InvokeVoidAsync("eval", …)`.
- **SSR-safe**. No DOM access occurs before `OnAfterRenderAsync`.
- **Pure helper functions in `Locales.cs`** so consumers can reuse
  them outside the component: `Bcp47LocaleTag`, `IsRtlLocale`,
  `LocaleName`, `DefaultLocaleLabels`, `RtlLanguageTags`,
  `RtlScriptSubtags`.

## 4. Public API

### 4.1 Parameters

| Parameter             | Type                                  | Required | Default                       | Purpose |
| --------------------- | ------------------------------------- | -------- | ----------------------------- | ------- |
| `Label`               | `string`                              | yes      | —                             | Accessible name for the radiogroup. |
| `Locales`             | `IReadOnlyList<string>`               | yes      | —                             | Available locale codes. |
| `Value`               | `string`                              | no       | `""`                          | Currently selected locale code. Two-way bindable via `@bind-Value`. |
| `ValueChanged`        | `EventCallback<string>`               | no       | —                             | Two-way binding callback. |
| `DefaultValue`        | `string?`                             | no       | `"en"` if present, else `Locales[0]` | Initial locale when nothing else is supplied. |
| `StorageKey`          | `string?`                             | no       | `null`                        | If set, persist selection to `localStorage`. |
| `DetectFromNavigator` | `bool`                                | no       | `false`                       | If true and no value/storage entry exists, resolve `navigator.language`. |
| `Name`                | `string`                              | no       | `"locale"`                    | `name` shared by the radio inputs. |
| `ApplyDir`            | `bool`                                | no       | `true`                        | If false, the picker only writes `lang` and never touches `dir`. |
| `LocaleLabels`        | `IReadOnlyDictionary<string,string>`  | no       | empty                         | Optional pretty labels per locale code. |
| `ChildContent`        | `RenderFragment<LocalePickerContext>?`| no       | default radio markup          | Custom rendering of the options. |
| `OnChange`            | `EventCallback<string>`               | no       | —                             | Fires after the picker applies a new locale. |
| `CssClass`            | `string`                              | no       | `""`                          | Extra CSS class merged into the `<fieldset>` root. |
| `AdditionalAttributes`| `Dictionary<string,object>?`          | no       | —                             | Captures unmatched attributes; spread onto the root. |

### 4.2 `LocalePickerContext`

```csharp
public sealed class LocalePickerContext
{
    public required IReadOnlyList<string> Locales { get; init; }
    public required string Value { get; init; }
    public required Func<string, Task> SetLocale { get; init; }
    public required string Name { get; init; }
    public required Func<string, string> LabelFor { get; init; }
    public required Func<string, string> TagFor { get; init; }
    public required Func<string, bool> IsRtl { get; init; }
}
```

### 4.3 DOM contract

- Root element: `<fieldset class="locale-picker {CssClass}"
  role="radiogroup" aria-label="{Label}">`.
- Default children: one `<label class="locale-picker-option"
  lang="{TagFor(locale)}">` per locale code containing
  `<input type="radio" name="{Name}" value="{locale}"
  checked={Value == locale}>` followed by
  `<span class="locale-picker-option-label">{LabelFor(locale)}</span>`.
- Each option carries `lang="{TagFor(locale)}"` so assistive
  technology pronounces option text in the appropriate language.
- `lang="{TagFor(slug)}"` is set on `document.documentElement` (or
  the consumer's target via JS interop) on every apply.
- If `ApplyDir` is true, `dir="rtl"` or `dir="ltr"` is set on every
  apply.

## 5. Behaviour

### 5.1 BCP 47 tag normalisation

`Bcp47LocaleTag(locale)` replaces every `_` with `-`. No case
normalisation is applied; consumers wanting canonical case
(language lowercase, script Title Case, region UPPERCASE) should
pre-normalise.

### 5.2 Initial value resolution

On first `OnAfterRenderAsync(firstRender: true)`, the initial locale
is the first non-empty value of:

1. `Value` (if a consumer supplied a non-empty string).
2. `localStorage.getItem(StorageKey)` (only if `StorageKey` is set).
3. `MatchNavigatorLanguage(Locales)` (only if `DetectFromNavigator`
   is true).
4. `DefaultValue`.
5. `"en"` if present in `Locales`, else `Locales[0]`.
6. `""` (no apply happens — the picker waits for user interaction).

### 5.3 Navigator-language matching

When `DetectFromNavigator` is true, the helper inspects
`navigator.languages` (falling back to `[navigator.language]`) via JS
interop. Matching is case-insensitive on the language and region parts
and treats `-` and `_` as equivalent.

For each navigator entry:

1. Exact match on the locales list (with `-`/`_` equivalence).
2. Language-only match (the first locales entry whose base language
   matches).

### 5.4 Default labels

When `LocaleLabels[code]` is missing, the helper falls back to:

1. `DefaultLocaleLabels[code]` from the built-in `Locales.cs` table.
2. The raw `code`.

### 5.5 Applying a locale

Applying a locale `code` performs, in order:

1. Resolve the BCP 47 form via `Bcp47LocaleTag`.
2. Set `lang` on `document.documentElement`.
3. If `ApplyDir` is true, set `dir` to `"rtl"` or `"ltr"`.
4. If `StorageKey` is set, write `code` to `localStorage` inside a
   try/catch.
5. Invoke `OnChange` and `ValueChanged` with the original consumer-
   form code (not the BCP 47-normalised tag).

### 5.6 RTL detection

`IsRtlLocale(locale)` returns `true` when:

1. Any `-`-or-`_`-separated component matches an RTL script subtag
   case-insensitively: `Arab`, `Hebr`, `Mong`, `Nkoo`, `Syrc`,
   `Thaa`, `Adlm`. **OR**
2. The leading language subtag is one of: `ar`, `arc`, `ckb`, `dv`,
   `fa`, `he`, `iw`, `ji`, `ks`, `ku`, `mzn`, `ps`, `sd`, `ug`,
   `ur`, `yi`.

### 5.7 Reactivity

Parameter changes that alter `Value` re-trigger the apply effect.
Other parameter changes take effect on the next locale change.

### 5.8 Prerender / SSR

During static SSR or Blazor Server prerender, no JS interop is
attempted and no DOM is touched.

## 6. Accessibility

### 6.1 Roles and properties

- `<fieldset>` with `role="radiogroup"` is the announced container.
- `aria-label={Label}` supplies the group name.
- Native `<input type="radio">` elements give radio role, checked
  state, and keyboard semantics.
- Each option carries `lang="{TagFor(locale)}"` — WCAG 3.1.2 (Language
  of Parts).
- The document root receives `lang` and (by default) `dir` — WCAG
  3.1.1 (Language of Page) and 1.4.10 (Reflow / bidi).

### 6.2 Keyboard contract

| Key            | Action                                           |
| -------------- | ------------------------------------------------ |
| `Tab`          | Move focus into / out of the group.              |
| `Arrow` keys   | Move selection between options.                  |
| `Space`        | Select the focused option.                       |

### 6.3 Internationalisation

- `Label`, `LocaleLabels`, and the consumer-supplied `Locales` array
  are passed through verbatim.
- No user-facing strings are hardcoded.

### 6.4 BCP 47 reference

Language-tag syntax is defined by IETF BCP 47 (RFC 5646). The HTML
`lang` attribute must use hyphens; underscores are common in
application identifiers but get normalised on output.

References this helper relies on:

- W3C — Language tags in HTML and XML:
  <https://www.w3.org/International/articles/language-tags/>
- RFC 5646 (BCP 47): <https://www.rfc-editor.org/rfc/rfc5646>
- IANA Language Subtag Registry:
  <https://www.iana.org/assignments/language-subtag-registry>
- HTML Living Standard `lang` attribute:
  <https://html.spec.whatwg.org/multipage/dom.html#the-lang-and-xml:lang-attributes>
- HTML Living Standard `dir` attribute:
  <https://html.spec.whatwg.org/multipage/dom.html#the-dir-attribute>
- WAI-ARIA APG — Radio Group pattern:
  <https://www.w3.org/WAI/ARIA/apg/patterns/radio/>

## 7. Testing acceptance criteria

`LocalePickerTests.cs` must assert every numbered item below. Tests
run under bUnit + xUnit.

### 7.1 Markup contract (mirrors §4.3)

1. Renders a `<fieldset>` with `role="radiogroup"`.
2. `aria-label` is the supplied `Label`.
3. Renders one radio input per entry in `Locales`, sharing the supplied
   `Name` attribute.
4. Each radio's `value` attribute is the locale code.
5. Each option carries `lang="{TagFor(locale)}"` (BCP 47 hyphen form).
6. The default rendering shows `LocaleLabels[code] ??
   DefaultLocaleLabels[code] ?? code` as the visible option text.

### 7.2 Pure helpers (mirrors §5.1, §5.6)

7. `Bcp47LocaleTag("en_US")` is `"en-US"`.
8. `Bcp47LocaleTag("zh_Hant_TW")` is `"zh-Hant-TW"`.
9. `Bcp47LocaleTag("en")` is `"en"`.
10. `IsRtlLocale("ar")`, `IsRtlLocale("he_IL")`, and
    `IsRtlLocale("uz_Arab_AF")` are all `true`.
11. `IsRtlLocale("en")` and `IsRtlLocale("fr_CA")` are both `false`.
12. `LocaleName("en_US")` returns `"English (United States)"` from the
    built-in table.

### 7.3 Locale application (mirrors §5.5)

13. After the first render, the interop call sets `lang` to the BCP 47
    form of the resolved initial locale.
14. After the first render with an RTL locale, the interop call sets
    `dir="rtl"`; for an LTR locale, `dir="ltr"`.
15. When `ApplyDir` is false, the interop call does not write `dir`.
16. Selecting a different radio updates `Value`, fires `OnChange` /
    `ValueChanged` with the consumer-form code (not the BCP 47 tag),
    and invokes interop with the new lang / dir.
17. The interop script includes the language tag normalised via
    `Bcp47LocaleTag`.

### 7.4 Initial-value resolution (mirrors §5.2, §5.3)

18. When `StorageKey` is set, the interop script contains the storage
    write.
19. When `Value` is supplied as a non-empty parameter, the
    initial-value resolution skips storage and defaults and applies
    that value.
20. (Reserved — `DetectFromNavigator` exact-match is documented in
    `MatchNavigatorLanguage` unit tests.)
21. (Reserved — `DetectFromNavigator` language-only fallback is
    documented in `MatchNavigatorLanguage` unit tests.)

### 7.5 Spread + custom children (mirrors §4.1, §4.2)

22. Extra attributes captured by `AdditionalAttributes` spread through
    onto the `<fieldset>` (e.g. `data-testid`).
23. A custom `ChildContent` receives `LocalePickerContext` with
    `Locales`, `Name`, `TagFor`, and `IsRtl` exposed.

## 8. Out-of-scope (future, not implemented here)

- A complementary `LocaleView` helper.
- A `LocaleSelect` sibling defaulting to `<select>` markup.
- A built-in `Accept-Language`-header server helper for SSR.

## 9. Tracking

- Package directory:
  `lily-design-system-blazor-helpers/lily-design-system-blazor-locale-picker/`
- Spec version: 0.1.0
- Created: 2026-06-05
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause (or
  contact for other terms)
- Contact: Joel Parker Henderson &lt;joel@joelparkerhenderson.com&gt;
- Canonical locale list: [locales.tsv](./locales.tsv) — 436 codes with
  English names (verbatim copy of the Svelte canonical).
