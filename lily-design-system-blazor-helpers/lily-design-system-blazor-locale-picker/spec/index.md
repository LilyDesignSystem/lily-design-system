# LocaleChooser — Specification (Blazor)

Single source of truth for the
`lily-design-system-blazor-locale-chooser` Blazor helper. This file
drives implementation, testing, and documentation in the
spec-driven-development style: anything not in this spec is out of
scope; anything in this spec must be exercised by a test.

Sibling files in this directory:

- `LocaleChooser.razor` — Razor markup
- `LocaleChooser.razor.cs` — C# code-behind (partial class)
- `LocaleChooserTests.cs` — bUnit + xUnit spec exercising every clause in §4–§7
- `Locales.cs` — built-in locale-code → English-name table, RTL sets, and pure helpers (port of `locales.ts`)
- `locales.tsv` — canonical 436-row list of locale codes and English names (verbatim copy of the Svelte canonical)
- `index.md` — user-facing readme

The Blazor headless library does not (yet) include a canonical
`LocaleChooser`; this helper is the opinionated, reusable counterpart
that owns the locale-application lifecycle (the `lang` and `dir`
attributes on the document root) and the persistence choice.

---

## 1. Goal

Give a Blazor application a drop-in, headless locale select that:

1. Renders an accessible icon button that opens a dropdown listbox of
   available locales (WAI-ARIA APG listbox pattern).
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
   `locale-chooser` class hook and the `lang` / `dir` attributes.
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
- **A radio-group default rendering**. The default is an icon button
  plus a listbox, for symmetry with `ThemeChooser`.

## 3. Architectural decisions

- **The `lang` attribute is the source of truth**. Every i18n
  library agrees that `document.documentElement.lang` is the
  authoritative signal for current document language (WCAG 3.1.1).
- **The `dir` attribute is the secondary switch**. Setting `dir` on
  the document root mirrors layout, scrollbars, and bidi text.
- **BCP 47 hyphen form on the wire**. Locale codes are stored in the
  consumer's array using whichever form they prefer (`en_US`,
  `en-US`, or `en`). When the select writes to the DOM, it normalises
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
| `Label`               | `string`                              | yes      | —                             | Accessible name for the button AND the listbox. The button is icon-only, so this is its entire accessible name. |
| `Locales`             | `IReadOnlyList<string>`               | yes      | —                             | Available locale codes. |
| `Value`               | `string`                              | no       | `""`                          | Currently selected locale code. Two-way bindable via `@bind-Value`. |
| `ValueChanged`        | `EventCallback<string>`               | no       | —                             | Two-way binding callback. |
| `DefaultValue`        | `string?`                             | no       | `"en"` if present, else `Locales[0]` | Initial locale when nothing else is supplied. |
| `StorageKey`          | `string?`                             | no       | `null`                        | If set, persist selection to `localStorage`. |
| `DetectFromNavigator` | `bool`                                | no       | `false`                       | If true and no value/storage entry exists, resolve `navigator.language`. |
| `Name`                | `string`                              | no       | `"locale"`                    | `name` set on the hidden input. |
| `ApplyDir`            | `bool`                                | no       | `true`                        | If false, the control only writes `lang` and never touches `dir`. |
| `LocaleLabels`        | `IReadOnlyDictionary<string,string>`  | no       | empty                         | Optional pretty labels per locale code. |
| `ChildContent`        | `RenderFragment<LocaleChooserContext>?`| no       | the default glyph             | **Replaces the glyph inside the button.** It does not render options. |
| `OnChange`            | `EventCallback<string>`               | no       | —                             | Fires after the control applies a new locale. |
| `CssClass`            | `string`                              | no       | `""`                          | Extra CSS class merged into the root `<div>`. |
| `AdditionalAttributes`| `Dictionary<string,object>?`          | no       | —                             | Captures unmatched attributes; spread onto the root `<div>`. |

There is **no `Placeholder` parameter**. It existed only to pin a native
`<select>`'s closed display; there is no `<select>` any more.

### 4.2 `LocaleChooserContext`

Mirrors the canonical Svelte `ChildArgs`:

```csharp
public sealed class LocaleChooserContext
{
    /// Currently selected locale code (consumer form, not BCP 47).
    public required string Value { get; init; }
    /// Is the listbox open?
    public required bool Open { get; init; }
    /// Resolve a locale code to its display label.
    public required Func<string, string> LabelFor { get; init; }
}
```

Public constant: `LocaleChooser.GlobeWithMeridians` — the default glyph,
`"🌐︎"` (U+1F310 `&#127760;` followed by U+FE0E VARIATION SELECTOR-15
`&#65038;`). VS15 selects the text presentation so the globe renders
monochrome, matching ThemeChooser's U+25D1 `◑`.

Public method: `Task SetLocaleAsync(string code)` — apply a locale
imperatively, for consumers driving the control from their own UI.

The pure helpers `Bcp47LocaleTag`, `IsRtlLocale`, `LocaleName`,
`MatchNavigatorLanguage`, `DefaultLocaleLabels`, `RtlLanguageTags`, and
`RtlScriptSubtags` remain on the static `Locales` class, unchanged.

### 4.3 DOM contract

The control is an icon button plus a dropdown listbox:

```html
<div class="locale-chooser {CssClass}" ...AdditionalAttributes>
  <input type="hidden" name="{Name}" value="{Value}" />
  <button type="button" class="locale-chooser-button"
          aria-label="{Label}" aria-haspopup="listbox"
          aria-expanded="false" aria-controls="{listId}">
    <span class="locale-chooser-icon" aria-hidden="true">&#127760;</span>
  </button>
  <ul class="locale-chooser-list" id="{listId}" role="listbox"
      aria-label="{Label}" tabindex="-1" hidden
      aria-activedescendant="{optionId of active, only while open}">
    <li class="locale-chooser-option" id="{optionId}" role="option"
        aria-selected="true|false" data-active
        lang="{TagFor(locale)}">{LabelFor(locale)}</li>
  </ul>
</div>
```

- The root is a `<div>` carrying the `locale-chooser` class hook plus
  `CssClass`; `AdditionalAttributes` spread onto it.
- The glyph is `🌐︎` (U+1F310 GLOBE WITH MERIDIANS `&#127760;` plus
  U+FE0E VARIATION SELECTOR-15 `&#65038;`), wrapped in
  `aria-hidden="true"`. The accessible name comes from the
  button's `aria-label` — never from the glyph.
- `ChildContent` **replaces the glyph inside the button** and receives
  `{ Value, Open, LabelFor }`. It no longer renders options.
- The hidden input preserves form participation and the `Name`
  parameter.
- Each option carries `lang="{TagFor(locale)}"` so assistive technology
  pronounces the option text in the appropriate language — WCAG 3.1.2.
  The button and the list carry **no** `lang`.
- `hidden` is present on the `<ul>` while closed and absent while open;
  `aria-expanded` on the button tracks the same state.
- `aria-activedescendant` is emitted only while open and only when it
  points at a real option. The active option additionally carries a
  `data-active` attribute as a styling hook.
- Option ids are `{instance}-option-{index}` and the list id is
  `{instance}-list`, where `{instance}` is `locale-chooser-{n}` from a
  monotonic process-wide counter. Stable and SSR-safe — never `Random`
  or a clock read.
- There is no `<select>`, no placeholder option, and no snap-back
  interop write. The real selection lives in `Value`, which remains
  two-way bindable.
- `lang="{TagFor(code)}"` is set on `document.documentElement` (or
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
6. `""` (no apply happens — the select waits for user interaction).

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

- The `<button type="button">` is the trigger. It carries
  `aria-haspopup="listbox"`, `aria-expanded`, and `aria-controls`
  pointing at the list id.
- `aria-label={Label}` supplies the accessible name for the button and
  the listbox. The button is icon-only, so `Label` is load-bearing:
  without it the control is unnameable.
- The `<ul role="listbox" tabindex="-1">` receives focus while open;
  the active option is conveyed by `aria-activedescendant`, per the APG
  listbox pattern (focus stays on the list, not on the options).
- Each `<li role="option">` carries `aria-selected`. Exactly one option
  is `aria-selected="true"` whenever `Value` matches a code.
- Each option carries `lang="{TagFor(locale)}"` — WCAG 3.1.2 (Language
  of Parts).
- The glyph is `aria-hidden="true"` and never contributes to the name.
- The document root receives `lang` and (by default) `dir` — WCAG
  3.1.1 (Language of Page) and 1.4.10 (Reflow / bidi).

### 6.2 Keyboard contract

Implemented by the component, following the WAI-ARIA APG listbox
pattern.

On the **button**:

| Key                        | Action                                                   |
| -------------------------- | -------------------------------------------------------- |
| `Tab` / `Shift+Tab`        | Move focus to / away from the button (one stop).         |
| `Arrow Down`               | Open, active option = the selected one (else index 0).   |
| `Enter` / `Space`          | Open, active option = the selected one (else index 0).   |
| `Arrow Up`                 | Open with the **last** option active.                    |

Opening moves focus to the `<ul>`.

On the **listbox**:

| Key             | Action                                                              |
| --------------- | ------------------------------------------------------------------- |
| `Arrow Down`    | Move the active option down one; **clamps** at the last (no wrap).  |
| `Arrow Up`      | Move the active option up one; **clamps** at the first (no wrap).   |
| `Home`          | Jump to the first option.                                           |
| `End`           | Jump to the last option.                                            |
| `Enter` / `Space` | Select the active option, apply it, close, return focus to the button. |
| `Escape`        | Close and return focus **without** changing the value.              |
| `Tab`           | Close **without** stealing focus back.                              |
| Printable chars | Typeahead over the option *labels*, 500 ms buffer reset.            |

Pointer and focus:

- Clicking an option selects it, applies it, and closes.
- Focus leaving the root closes the listbox without changing the value.

### 6.2.1 Framework deviations

Two clauses cannot be met faithfully with Blazor's declarative event
bindings; both are behavioural refinements, not contract breaks.

- **No `preventDefault` on keydown.** Blazor evaluates
  `@onkeydown:preventDefault` at render time, not per event, so it
  cannot be applied to arrow keys while leaving `Tab` alone. Arrow keys
  and `Space` therefore also scroll the page in their default way. To
  keep `Enter` / `Space` from toggling the listbox twice (a `<button>`
  synthesises a click for both), the component swallows the click that
  follows a keydown it already handled.
- **No document-level click listener.** The Svelte reference closes on
  any outside click via `<svelte:document onclick>`. Blazor has no
  declarative equivalent and this package ships no JavaScript, so
  closing on outside interaction is driven by the root's `focusout`
  instead. Because Blazor's `FocusEventArgs` does not expose
  `relatedTarget`, the component flags focus moves it makes itself and
  ignores the matching `focusout`.

`@onmousedown:preventDefault` **is** applied to the `<ul>`: that one is
unconditional and correct, and it stops a click on an option from
blurring the listbox before the click handler runs.

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
- WAI-ARIA Authoring Practices — Listbox pattern:
  <https://www.w3.org/WAI/ARIA/apg/patterns/listbox/>
- WAI-ARIA Authoring Practices — Select-Only Combobox:
  <https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/>

## 7. Testing acceptance criteria

`LocaleChooserTests.cs` must assert every numbered item below. Tests
run under bUnit + xUnit.

### 7.1 Markup contract (mirrors §4.3)

1. The root is a `<div class="locale-chooser">` containing a
   `<button type="button" class="locale-chooser-button">` with
   `aria-haspopup="listbox"`, `aria-expanded="false"`, and
   `aria-controls` pointing at a `<ul role="listbox" tabindex="-1">`.
   No `<select>` is rendered.
2. The button renders `<span class="locale-chooser-icon"
   aria-hidden="true">🌐︎</span>` (U+1F310 + U+FE0E), matching the
   public `LocaleChooser.GlobeWithMeridians` constant.
3. `aria-label` is the supplied `Label` on BOTH the button and the
   listbox.
4. One `<li class="locale-chooser-option" role="option">` per entry in
   `Locales`; the hidden input carries the supplied `Name` and the
   resolved `Value`.
5. Each option carries `lang="{TagFor(locale)}"` (BCP 47 hyphen form);
   the button and the listbox carry no `lang`.
6. The listbox carries `hidden` until the button is activated;
   activating toggles both `hidden` and `aria-expanded`.
7. Exactly one option is `aria-selected="true"` — the active locale.
   While closed there is no `aria-activedescendant`; opening points it
   at the active option, which also carries `data-active`.
8. The default rendering shows `LocaleLabels[code] ??
   DefaultLocaleLabels[code] ?? code` as the visible option text.
9. List and option ids are stable across re-render and unique across
   instances, prefixed `locale-chooser-`.

### 7.2 Keyboard contract (mirrors §6.2)

10. `ArrowDown`, `Enter` and `Space` on the button each open the
    listbox with the currently-selected option active.
11. `ArrowUp` on the button opens with the **last** option active.
12. `ArrowDown` / `ArrowUp` inside the listbox move the active option
    and **clamp** at both ends (no wrapping).
13. `Home` / `End` jump to the first / last option.
14. `Enter` and `Space` inside the listbox select the active option,
    apply it, and close; the callbacks report the CONSUMER-form code
    (not the BCP 47 tag), and an RTL choice sets `dir="rtl"`.
15. `Escape` closes the listbox **without** changing the value and
    without applying anything.
16. Printable characters run a typeahead over the option labels; a
    buffer that matches nothing leaves the active option unmoved.
17. Clicking an option selects it, applies it, and closes the listbox.
18. Focus leaving the root closes the listbox without changing the
    value.

### 7.3 Pure helpers (mirrors §5.1, §5.5, §5.6)

19. `Bcp47LocaleTag("en_US")` is `"en-US"`.
20. `Bcp47LocaleTag("zh_Hant_TW")` is `"zh-Hant-TW"`; `"en"` is
    unchanged.
21. `IsRtlLocale("ar")`, `IsRtlLocale("he_IL")` and
    `IsRtlLocale("uz_Arab_AF")` (any case) are `true`;
    `IsRtlLocale("en")`, `IsRtlLocale("fr_CA")` and `IsRtlLocale("")`
    are `false`.
22. `LocaleName("en_US")` returns `"English (United States)"` from the
    built-in table.
23. The apply script sets `lang` to the BCP 47 form, normalised via
    `Bcp47LocaleTag`.
24. The apply script sets `dir` from RTL detection, and omits the `dir`
    write entirely when `ApplyDir` is false (while still writing
    `lang`).
25. When `StorageKey` is set, the apply script writes to
    `localStorage`; when it is not set, it contains no such write.
26. `MatchNavigatorLanguage` matches exactly first, then falls back to
    a language-only match, and returns `""` when nothing matches.

### 7.4 Lifecycle, spread, custom rendering

27. When `Value` is supplied as a non-empty parameter, the
    initial-value resolution skips storage and defaults and applies
    that value.
28. Extra attributes captured by `AdditionalAttributes` spread through
    onto the root `<div>` (e.g. `data-testid`).
29. A custom `ChildContent` render fragment **replaces** the glyph
    inside the button (the default `.locale-chooser-icon` is absent) and
    receives `Value`, `Open`, and `LabelFor`.

## 8. Out-of-scope (future, not implemented here)

- A complementary `LocaleView` helper.
- A `LocaleChooser` sibling defaulting to radio-group markup.
- A built-in `Accept-Language`-header server helper for SSR.

## 9. Tracking

- Package directory:
  `lily-design-system-blazor-helpers/lily-design-system-blazor-locale-chooser/`
- Spec version: 0.1.0
- Created: 2026-06-05
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause (or
  contact for other terms)
- Contact: Joel Parker Henderson &lt;joel@joelparkerhenderson.com&gt;
- Canonical locale list: [locales.tsv](../locales.tsv) — 436 codes with
  English names (verbatim copy of the Svelte canonical).
