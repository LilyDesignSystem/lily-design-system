# AGENTS — PickerBar (Blazor helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A composed Blazor header control: one `<div class="picker-bar">` that
renders `ThemePicker`, `LocalePicker`, `TextSizePicker`, and
`SharePicker` — four of the six `*-picker` helpers — in that fixed
order, each referenced from its own sibling package in this catalog
via `ProjectReference` (which `dotnet pack` turns into a real NuGet
dependency on each sibling's own published version). It adds no
lifecycle of its own beyond two catalog-specific defaults: the full
45-theme reference list (§5.1 of the spec) and the seven-step
text-size scale (§5.2). `motion-picker` and `date-time-picker` are
deliberately not included — see spec §1.

## Files

| File                 | Purpose                                       |
| -------------------- | ---------------------------------------------- |
| `spec/index.md`      | Specification-driven contract (canonical).     |
| `PickerBar.razor`    | Razor markup.                                  |
| `PickerBar.razor.cs` | C# code-behind (partial class).                |
| `PickerBarTests.cs`  | bUnit + xUnit spec, one `[Fact]` per §7 item.  |
| `index.md`           | User guide.                                    |

## Public surface

- Component: `PickerBar` in namespace `LilyDesignSystem.Blazor.Helpers`.
- Record: `PickerBarLabels` (`Theme`, `Locale`, `TextSize`, `Share`) —
  all `required`, no English default.
- Statics: `PickerBar.DefaultThemes` (45 slugs), `PickerBar.DefaultSizes`
  (7 slugs).
- Required parameters: `Labels`, `ThemesUrl`, `Locales`.
- No two-way binding of its own — each wrapped picker keeps its own
  `@bind-Value` if the consumer needs it, reached via that picker's
  `*Attributes` dictionary.

## Behaviour contract (one paragraph)

`PickerBar` renders the four wrapped pickers unmodified, passing each
its own required parameters plus any extras from that picker's
`*Attributes` dictionary (`ThemeAttributes`, `LocaleAttributes`,
`TextSizeAttributes`, `ShareAttributes`), splatted via `@attributes`
**after** the bar's own parameters so a consumer can override anything
(Blazor's attribute-splat merge is last-value-wins, same ordering
guarantee as the canonical Svelte spread). `Themes` defaults to
`DefaultThemes` (all 45 reference theme slugs, alphabetical with the
UK/US themes moved to one alphabetical group at the bottom); `Sizes`
defaults to `DefaultSizes` (`largest` … `smallest`, seven slugs) with
the nested `TextSizePicker`'s `DefaultValue` set to `"normal"`
(`TextSizePicker`'s own `"medium"` fallback does not exist in this
seven-slug scale). Every other parameter — persistence, initial value,
detection, glyph override — is exactly the wrapped picker's own
contract; see that picker's own `AGENTS.md`.

## Markup

```html
<div class="picker-bar {CssClass}" ...AdditionalAttributes>
  <div class="theme-picker">…</div>
  <div class="locale-picker">…</div>
  <div class="text-size-picker">…</div>
  <div class="share-picker">…</div>
</div>
```

No new class hooks — each child keeps its own package's class
contract. `PickerBar` contributes only the `picker-bar` root class.

## Accessibility

WCAG 2.2 AAA target — unchanged from each wrapped picker, since
`PickerBar` adds no new interaction. `Labels` supplies all four
accessible names; there is no English default (see
`DateTimePickerLabels`'s precedent in AGENTS/helpers.md for why a bar
of structural labels this catalog invented gets none).

## Conventions this package follows

- Blazor 10 / .NET 10, `partial class` split between `PickerBar.razor`
  and `PickerBar.razor.cs`. Namespace `LilyDesignSystem.Blazor.Helpers`.
- `[Parameter, EditorRequired]` for required parameters;
  `[Parameter(CaptureUnmatchedValues = true)]` for the root's own
  attribute spread; a `Dictionary<string, object>?` parameter per
  wrapped picker for that picker's own attribute spread.
- Depends on the four wrapped pickers as real project references
  within this monorepo (packed as real NuGet dependencies) — the same
  way any consumer would depend on them — not vendored or duplicated
  source.
- No bundled CSS, fonts, icons, or images.
- All user-facing strings come from parameters (`Labels`, and whatever
  each wrapped picker's own parameters require).
- Sets no `IJSRuntime` interop of its own — it has no lifecycle beyond
  rendering its four children, so it needs no `OnAfterRenderAsync`.

## Local development note

Unlike a `PackageReference` to a registry version, this package's
`.csproj` uses `<ProjectReference>` to the four sibling `.csproj` files
in this same catalog, so building/testing it locally never depends on
those packages actually being resolvable from nuget.org — and the
shared `tests/LilyDesignSystem.Blazor.Helpers.Tests` project's own
`ProjectReference`s to those same four projects resolve to the exact
same build output (a normal diamond dependency), so there is no
duplicate-assembly risk. `dotnet pack` on this project still emits a
real NuGet `<dependency>` per sibling, at that sibling's own
`<Version>` — see spec/index.md §8.
