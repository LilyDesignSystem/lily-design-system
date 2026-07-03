# AGENTS — LocaleSelect (Blazor helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A reusable Blazor headless locale select that applies the chosen
locale to the document root via `lang` and `dir`, with optional
`localStorage` persistence and `navigator.languages` detection. Ships
no CSS; consumer styles the `locale-select` class hook.

## Files

| File                       | Purpose                                          |
| -------------------------- | ------------------------------------------------ |
| `spec/index.md`                  | Specification-driven contract (canonical).       |
| `LocaleSelect.razor`       | Razor markup.                                    |
| `LocaleSelect.razor.cs`    | C# code-behind (partial class).                  |
| `LocaleSelectTests.cs`     | bUnit + xUnit spec, one `[Fact]` per §7 item.    |
| `Locales.cs`               | Static helpers + label / RTL data tables.        |
| `locales.tsv`              | Canonical 436-row code → English-name list.      |
| `index.md`                 | User guide.                                      |

## Public surface

- Component: `LocaleSelect` in namespace
  `LilyDesignSystem.Blazor.Helpers`.
- Context: `LocaleSelectContext` for custom `ChildContent` rendering.
- Static helpers in `Locales` static class:
  - `Bcp47LocaleTag(string)`
  - `IsRtlLocale(string)`
  - `LocaleName(string)`
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

## HTML

`<select class="locale-select @CssClass" aria-label="@Label"
name="@Name">` with one native `<option>` per locale and a
`lang="@TagFor(locale)"` attribute on each `<option>`. Custom
rendering via the `ChildContent` render fragment receiving
`LocaleSelectContext`.

## Accessibility

- WCAG 2.2 AAA target.
- The native `<select>` provides Arrow / Home / End / typeahead
  semantics.
- `aria-label` carries the consumer-supplied accessible name.
- Each option has its own `lang` context — WCAG 3.1.2 "Language of
  Parts" — so screen readers pronounce "Français" with a French
  voice.

## Conventions this package follows

- Blazor partial class (`.razor` + `.razor.cs`).
- `[Parameter]` properties; `[Parameter(CaptureUnmatchedValues = true)]`
  for spread.
- `EventCallback<string>` for `ValueChanged`, `OnChange`.
- `IJSRuntime` injected for DOM mutation.
- No runtime dependency beyond `Microsoft.AspNetCore.Components.Web`.
- No bundled CSS, fonts, icons, or images.
- All user-facing strings come from parameters.
