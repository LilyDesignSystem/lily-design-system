# AGENTS — LocalePicker (Blazor helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A reusable Blazor headless locale select that applies the chosen
locale to the document root via `lang` and `dir`, with optional
`localStorage` persistence and `navigator.languages` detection. It
renders an icon button (`🌐`) that opens a dropdown listbox. Ships no
CSS; consumer styles the `locale-picker`, `locale-picker-button`,
`locale-picker-icon`, `locale-picker-list`, and `locale-picker-option`
class hooks.

## Files

| File                       | Purpose                                          |
| -------------------------- | ------------------------------------------------ |
| `spec/index.md`                  | Specification-driven contract (canonical).       |
| `LocalePicker.razor`       | Razor markup.                                    |
| `LocalePicker.razor.cs`    | C# code-behind (partial class).                  |
| `LocalePickerTests.cs`     | bUnit + xUnit spec, one `[Fact]` per §7 item.    |
| `Locales.cs`               | Static helpers + label / RTL data tables.        |
| `locales.tsv`              | Canonical 436-row code → English-name list.      |
| `index.md`                 | User guide.                                      |
| `docs/`                    | Topic guides: parameters, styling, custom rendering, recipes, troubleshooting, plus the locale-specific bcp47 / rtl / i18n-integration / concepts / ssr / accessibility. |
| `examples/`                | Self-contained `.razor` examples, descriptively named. |

## Public surface

- Component: `LocalePicker` in namespace
  `LilyDesignSystem.Blazor.Helpers`.
- Context: `LocalePickerContext` (`Value`, `Open`, `LabelFor`) for a
  custom `ChildContent` glyph.
- Constant: `LocalePicker.GlobeWithMeridians` — the default glyph
  `"🌐︎"` (U+1F310 + U+FE0E VARIATION SELECTOR-15, which forces the
  monochrome text presentation so it matches ThemePicker's `◑`).
- Method: `SetLocaleAsync(string code)`.
- Required parameters: `Label`, `Locales`.
- **Removed:** the `Placeholder` parameter. It only existed to pin a
  native `<select>`'s closed display; there is no `<select>` any more.
- Static helpers in `Locales` static class:
  - `Bcp47LocaleTag(string)`
  - `IsRtlLocale(string)`
  - `LocaleName(string)`
  - `LocaleEndonym(string)` — the language's own name for itself
    ("Deutsch", "Cymraeg") via `CultureInfo.NativeName`; `""` when the
    runtime cannot name the culture.
  - `MatchNavigatorLanguage(IReadOnlyList<string>, IReadOnlyList<string>)`
  - `DefaultLocaleLabels` (IReadOnlyDictionary<string,string>)
  - `RtlLanguageTags` (HashSet<string>)
  - `RtlScriptSubtags` (HashSet<string>)

## Behaviour contract (one paragraph)

On every locale change the select (1) sets
`document.documentElement.lang` to the BCP 47 hyphen form of the
slug, (2) sets `dir="rtl"` or `dir="ltr"` based on
`IsRtlLocale(slug)` unless `ApplyDir` is false, (3) optionally
writes the slug to `localStorage[StorageKey]`, and (4) invokes
`OnChange` and `ValueChanged` with the original consumer-form code.
All DOM writes happen through `IJSRuntime` inside
`OnAfterRenderAsync`. Initial value resolves from `Value` > storage
> navigator (if `DetectFromNavigator`) > `DefaultValue` > `"en"` (if
present) > `Locales[0]`.

The control is an **icon button plus a dropdown listbox**, not a native
`<select>`. The button shows only a glyph; the listbox is the WAI-ARIA
APG listbox pattern with `aria-activedescendant`. The real selection
lives in `Value` and rides a hidden input for form participation.

## HTML

```html
<div class="locale-picker @CssClass" ...AdditionalAttributes>
  <input type="hidden" name="@Name" value="@Value" />
  <button type="button" class="locale-picker-button" aria-label="@Label"
          aria-haspopup="listbox" aria-expanded="false" aria-controls="{listId}">
    <span class="locale-picker-icon" aria-hidden="true">🌐︎</span>
  </button>
  <ul class="locale-picker-list" id="{listId}" role="listbox" aria-label="@Label"
      tabindex="-1" hidden aria-activedescendant="{active option id, open only}">
    <li class="locale-picker-option" id="{optionId}" role="option"
        aria-selected="true|false" data-active
        lang="@OptionLang(code)">{LabelFor(code)}</li>
  </ul>
</div>
```

An option carries `lang` only when its label is the derived endonym —
`lang` is a claim about the text's language, and a consumer label or
the English-table fallback makes none; the button and the list carry
none either. Labels resolve `LocaleLabels` → endonym → English table →
raw code. `ChildContent` **replaces the glyph inside the button**; it no
longer renders options. Ids come from a monotonic process-wide counter
(`locale-picker-{n}`) so they are stable and SSR-safe.

## Keyboard

Button: `ArrowDown` / `Enter` / `Space` open on the selected option;
`ArrowUp` opens on the last. Opening moves focus to the `<ul>`.
Listbox: arrows move and **clamp**, `Home` / `End` jump, `PageUp` /
`PageDown` move by ten (clamped), `Enter` / `Space`
select-apply-close-and-refocus, `Escape` closes without changing the
value, `Tab` closes and lets the browser's default Tab proceed from
the picker's position (see the deviations below for why this port must
not refocus the button), printable characters run a 500 ms APG
typeahead over the labels — a repeated character cycles through its
matches; differing characters refine from the active option. Clicking
an option selects it; focus leaving the root closes. An empty list
opens with no `aria-activedescendant`.

## Accessibility

- WCAG 2.2 AAA target; WAI-ARIA APG listbox pattern.
- `aria-label` is the button's ENTIRE accessible name — the button is
  icon-only and the glyph is `aria-hidden="true"`.
- A locale option gets a `lang` context — WCAG 3.1.2 "Language of
  Parts" — only when its label is the derived endonym, so screen
  readers pronounce "Français" with a French voice but the English
  word "Arabic" is never handed to an Arabic speech engine.
- Known tradeoffs (icon-only naming, custom-listbox AT support, glyph
  font coverage) are documented in `docs/accessibility.md`.

## Blazor deviations from the canonical Svelte implementation

- No `preventDefault` on keydown: Blazor evaluates
  `@onkeydown:preventDefault` at render time, so it cannot spare `Tab`.
  A suppress-next-click flag stops `Enter` / `Space` toggling twice.
- No document-level click listener (the package ships no JS); the
  root's `focusout` closes the listbox instead. `FocusEventArgs` has no
  `relatedTarget`, so self-made focus moves are flagged and ignored.
- `Tab` from the open list does NOT refocus the button. The canonical
  Svelte fix does, because Svelte hides the list synchronously, ahead
  of the browser's default Tab; Blazor's async handler always runs
  after the default Tab has already proceeded from the still-visible
  list, so a button-focus request here would yank the user back to the
  trigger they just left. Both ports end with focus on the tab stop
  after the picker.
- Endonyms come from `CultureInfo.NativeName`, not `Intl.DisplayNames`
  (which .NET does not have). Formatting can differ slightly between
  the two ICU surfaces; both are true endonyms and the difference is
  accepted.
- `@onmousedown:preventDefault` IS applied to the `<ul>` so clicking an
  option does not blur the listbox first.

## Conventions this package follows

- Blazor partial class (`.razor` + `.razor.cs`).
- `[Parameter]` properties; `[Parameter(CaptureUnmatchedValues = true)]`
  for spread.
- `EventCallback<string>` for `ValueChanged`, `OnChange`.
- `IJSRuntime` injected for DOM mutation.
- No runtime dependency beyond `Microsoft.AspNetCore.Components.Web`.
- No bundled CSS, fonts, icons, or images.
- All user-facing strings come from parameters.
