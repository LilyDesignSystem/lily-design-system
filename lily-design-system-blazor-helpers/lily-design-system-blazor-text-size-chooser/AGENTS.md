# AGENTS — TextSizeChooser (Blazor helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A reusable Blazor headless text-size select that applies the chosen
size slug to the document root via `data-text-size`, with optional
`localStorage` persistence. It renders an icon button (`A`) that opens
a dropdown listbox. Ships no CSS; consumer styles the
`text-size-chooser`, `text-size-chooser-button`, `text-size-chooser-icon`,
`text-size-chooser-list`, and `text-size-chooser-option` class hooks —
see `docs/styling.md` — and maps each `[data-text-size="…"]` slug to
real typography.

## Files

| File                       | Purpose                                          |
| -------------------------- | ------------------------------------------------ |
| `spec/index.md`            | Specification-driven contract (canonical).       |
| `TextSizeChooser.razor`     | Razor markup.                                    |
| `TextSizeChooser.razor.cs`  | C# code-behind (partial class).                  |
| `TextSizeChooserTests.cs`   | bUnit + xUnit spec, one `[Fact]` per §7 item.    |
| `index.md`                 | User guide.                                      |
| `docs/`                    | Accessibility and styling guides.                |
| `examples/`                | Copy-pasteable Razor snippets.                   |

## Public surface

- Component: `TextSizeChooser` in namespace
  `LilyDesignSystem.Blazor.Helpers`.
- Context: `TextSizeChooserContext` (`Value`, `Open`, `LabelFor`) for a
  custom `ChildContent` glyph.
- Constant: `TextSizeChooser.LatinCapitalLetterA` — the default glyph
  `"A"` (U+0041).
- Statics: `SizeName`.
  - `SizeName(slug)` — the ONE title-casing rule (`"x-large"` ->
    `"X Large"`); the private instance `LabelFor` delegates to it, so
    consumers rendering their own UI never duplicate it. Mirrors
    `ThemeChooser.ThemeName` and `Locales.LocaleName`.
- Method: `SetSizeAsync(string slug)`.
- Required parameters: `Label`, `Sizes`.
- Two-way binding: `@bind-Value` (string slug).
- Internal statics (visible to the test project):
  `BuildApplyScript(string, string?)`.
- **No `DetectFromSystem`.** Unlike ThemeChooser and LocaleChooser, there
  is no OS "preferred text size" signal to detect — no media query
  equivalent to `prefers-color-scheme` / `navigator.languages` exists.

## Behaviour contract (one paragraph)

On every size change the control (1) sets `data-text-size="{slug}"` on
`document.documentElement`, (2) optionally writes the slug to
`localStorage[StorageKey]`, and (3) invokes `OnChange` and
`ValueChanged` with the slug. All DOM writes happen through
`IJSRuntime` inside `OnAfterRenderAsync`, so the component is SSR /
prerender safe. Initial value resolves from `Value` > storage >
`DefaultValue` > `"medium"` (if present) > `Sizes[0]`.

The control is an **icon button plus a dropdown listbox**, not a native
`<select>`. The button shows only a glyph; the listbox is the WAI-ARIA
APG listbox pattern with `aria-activedescendant`. The real selection
lives in `Value` and rides a hidden input for form participation.

## HTML

```html
<div class="text-size-chooser @CssClass" ...AdditionalAttributes>
  <input type="hidden" name="@Name" value="@Value" />
  <button type="button" class="text-size-chooser-button" aria-label="@Label"
          aria-haspopup="listbox" aria-expanded="false" aria-controls="{listId}">
    <span class="text-size-chooser-icon" aria-hidden="true">A</span>
  </button>
  <ul class="text-size-chooser-list" id="{listId}" role="listbox" aria-label="@Label"
      tabindex="-1" hidden aria-activedescendant="{active option id, open only}">
    <li class="text-size-chooser-option" id="{optionId}" role="option"
        aria-selected="true|false" data-active>{LabelFor(slug)}</li>
  </ul>
</div>
```

`ChildContent` **replaces the glyph inside the button**; it no longer
renders options. Ids come from a monotonic process-wide counter
(`text-size-chooser-{n}`) so they are stable and SSR-safe.

## Keyboard

Button: `ArrowDown` / `Enter` / `Space` open on the selected option;
`ArrowUp` opens on the last. Opening moves focus to the `<ul>`.
Listbox: arrows move and **clamp**, `Home` / `End` jump, `Enter` /
`Space` select-apply-close-and-refocus, `Escape` closes without
changing the value, `Tab` closes without stealing focus, printable
characters run a 500 ms typeahead over the labels. Clicking an option
selects it; focus leaving the root closes.

## Accessibility

- WCAG 2.2 AAA target; directly supports 1.4.4 (Resize Text).
- WAI-ARIA APG listbox pattern.
- `aria-label` is the button's ENTIRE accessible name — the button is
  icon-only and the glyph is `aria-hidden="true"`.
- Option labels default to title-cased slugs.
- Known tradeoffs (icon-only naming, custom-listbox AT support, glyph
  font coverage) are documented in `docs/accessibility.md`. The `"A"`
  glyph is materially safer than a pictograph on the last point.

## Blazor deviations from the canonical Svelte implementation

- No `preventDefault` on keydown: Blazor evaluates
  `@onkeydown:preventDefault` at render time, so it cannot spare `Tab`.
  A suppress-next-click flag stops `Enter` / `Space` toggling twice.
- No document-level click listener (the package ships no JS); the
  root's `focusout` closes the listbox instead. `FocusEventArgs` has no
  `relatedTarget`, so self-made focus moves are flagged and ignored.
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
