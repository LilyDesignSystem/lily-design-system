# AGENTS — ThemePicker (Blazor helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A reusable Blazor headless theme select that **loads theme CSS files
dynamically at runtime** from a developer-supplied directory URL. It
renders an icon button (`◑`) that opens a dropdown listbox. Ships no
CSS; consumer styles the `theme-picker`, `theme-picker-button`,
`theme-picker-icon`, `theme-picker-list`, and `theme-picker-option`
class hooks — see `docs/styling.md`.

## Files

| File                    | Purpose                                       |
| ----------------------- | --------------------------------------------- |
| `spec/index.md`         | Specification-driven contract (canonical).    |
| `ThemePicker.razor`    | Razor markup.                                 |
| `ThemePicker.razor.cs` | C# code-behind (partial class).               |
| `ThemePickerTests.cs`  | bUnit + xUnit spec, one `[Fact]` per §7 item. |
| `index.md`              | User guide.                                   |

## Public surface

- Component: `ThemePicker` in namespace `LilyDesignSystem.Blazor.Helpers`.
- Context: `ThemePickerContext` (`Value`, `Open`, `LabelFor`) for a
  custom `ChildContent` glyph.
- Constant: `ThemePicker.CircleWithRightHalfBlack` — the default glyph
  `"◑"` (U+25D1).
- Statics: `NormaliseThemesUrl`, `ThemeHref`, `ThemeName`,
  `MatchSystemTheme`.
  - `ThemeName(slug)` — the ONE title-casing rule
    (`"high-contrast"` -> `"High Contrast"`); the private instance
    `LabelFor` delegates to it, so consumers rendering their own UI
    never duplicate it. Mirrors `Locales.LocaleName` on LocalePicker.
  - `MatchSystemTheme(bool? prefersDark, themes)` — pure mapping of an
    OS colour-scheme preference onto a supported slug; returns `""`
    when unsupported or when `prefersDark` is null (matchMedia
    unavailable). Mirrors `Locales.MatchNavigatorLanguage`.
- Method: `SetThemeAsync(string slug)`.
- Required parameters: `Label`, `ThemesUrl`, `Themes`.
- Two-way binding: `@bind-Value` (string slug).
- **Removed:** the `Placeholder` parameter. It only existed to pin a
  native `<select>`'s closed display; there is no `<select>` any more.

## Behaviour contract (one paragraph)

On every theme change the select (1) sets the `href` of one managed
`<link rel="stylesheet" data-lily-theme-picker="{Name}">` in
`document.head` to `{ThemesUrl}{slug}{Extension}`, (2) sets
`data-theme="{slug}"` on `document.documentElement`, (3) optionally
writes the slug to `localStorage[StorageKey]`, and (4) invokes
`OnChange` and `ValueChanged`. All DOM writes happen through
`IJSRuntime` inside `OnAfterRenderAsync`, so the component is SSR /
prerender safe. Initial value resolves from `Value` > storage >
`DetectFromSystem` (opt-in) >
`DefaultValue` > `"light"` (if present) > `Themes[0]`.

The control is an **icon button plus a dropdown listbox**, not a native
`<select>`. The button shows only a glyph; the listbox is the WAI-ARIA
APG listbox pattern with `aria-activedescendant`. The real selection
lives in `Value` and rides a hidden input for form participation.

## HTML

```html
<div class="theme-picker @CssClass" ...AdditionalAttributes>
  <input type="hidden" name="@Name" value="@Value" />
  <button
    type="button"
    class="theme-picker-button"
    aria-label="@Label"
    aria-haspopup="listbox"
    aria-expanded="false"
    aria-controls="{listId}"
  >
    <span class="theme-picker-icon" aria-hidden="true">&#9681;</span>
  </button>
  <ul
    class="theme-picker-list"
    id="{listId}"
    role="listbox"
    aria-label="@Label"
    tabindex="-1"
    hidden
    aria-activedescendant="{active option id, open only}"
  >
    <li
      class="theme-picker-option"
      id="{optionId}"
      role="option"
      aria-selected="true|false"
      data-active
    >
      {LabelFor(slug)}
    </li>
  </ul>
</div>
```

`ChildContent` **replaces the glyph inside the button**; it no longer
renders options. Ids come from a monotonic process-wide counter
(`theme-picker-{n}`) so they are stable and SSR-safe.

## Keyboard

Button: `ArrowDown` / `Enter` / `Space` open on the selected option;
`ArrowUp` opens on the last. Opening moves focus to the `<ul>`.
Listbox: arrows move and **clamp**, `Home` / `End` jump, `PageUp` /
`PageDown` move by ten (clamped), `Enter` / `Space`
select-apply-close-and-refocus, `Escape` closes without changing the
value, `Tab` closes and lets the browser's default Tab proceed from
the picker's position (see the deviations below for why this port
must not refocus the button), printable characters run a 500 ms APG
typeahead over the labels — a repeated character cycles through its
matches; differing characters refine from the active option. Clicking
an option selects it; focus leaving the root closes. An empty list
opens with no `aria-activedescendant`.

## Accessibility

- WCAG 2.2 AAA target; WAI-ARIA APG listbox pattern.
- `aria-label` is the button's ENTIRE accessible name — the button is
  icon-only and the glyph is `aria-hidden="true"`.
- Option labels default to title-cased slugs; the word "default" is
  never emitted.
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
