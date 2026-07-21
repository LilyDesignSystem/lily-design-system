# TextSizeChooser (Blazor helper)

A reusable, headless Blazor text-size select. Renders an **icon button
that opens a dropdown listbox** of size slugs and applies the chosen
slug to the document root via `data-text-size`, with optional
`localStorage` persistence. Ships no CSS — you style the class hooks
and map each `[data-text-size="{slug}"]` to real typography.

Single source of truth: [spec/index.md](./spec/index.md).

## Install

Add a project reference to
`LilyDesignSystem.Blazor.TextSizeChooser.csproj`, or the published
`LilyDesignSystem.Blazor.TextSizeChooser` NuGet package.

## Quick start

```razor
@using LilyDesignSystem.Blazor.Helpers

<TextSizeChooser Label="Text size"
                Sizes='new[] { "small", "medium", "large", "x-large" }'
                StorageKey="lily-text-size"
                @bind-Value="size" />

<p class="text-size-chooser-status" aria-live="polite">
    Text size: @TextSizeChooser.SizeName(size)
</p>

@code {
    private string size = "";
}
```

The closed control shows only a glyph, so nothing on screen says which
size is active. The status region above is the recommended companion —
see [docs/accessibility.md](./docs/accessibility.md).

Then style the slugs in your own CSS:

```css
:root[data-text-size="small"]   { font-size: 87.5%; }
:root[data-text-size="medium"]  { font-size: 100%; }
:root[data-text-size="large"]   { font-size: 112.5%; }
:root[data-text-size="x-large"] { font-size: 125%; }
```

## Rendered HTML

```html
<div class="text-size-chooser">
  <input type="hidden" name="text-size" value="medium" />
  <button type="button" class="text-size-chooser-button" aria-label="Text size"
          aria-haspopup="listbox" aria-expanded="false" aria-controls="text-size-chooser-1-list">
    <span class="text-size-chooser-icon" aria-hidden="true">A</span>
  </button>
  <ul class="text-size-chooser-list" id="text-size-chooser-1-list" role="listbox"
      aria-label="Text size" tabindex="-1" hidden>
    <li class="text-size-chooser-option" role="option" aria-selected="false">Small</li>
    <li class="text-size-chooser-option" role="option" aria-selected="true" data-active>Medium</li>
    <li class="text-size-chooser-option" role="option" aria-selected="false">Large</li>
    <li class="text-size-chooser-option" role="option" aria-selected="false">X Large</li>
  </ul>
</div>
```

The package ships no CSS, so give the root `position: relative` and the
list `position: absolute` or an open list will shove the page around.
See [docs/styling.md](./docs/styling.md).

## Parameters

| Parameter             | Type                                     | Required | Default                                |
| --------------------- | ---------------------------------------- | -------- | -------------------------------------- |
| `Label`               | `string`                                 | yes      | —                                      |
| `Sizes`               | `IReadOnlyList<string>`                  | yes      | —                                      |
| `Value`               | `string`                                 | no       | `""`                                   |
| `ValueChanged`        | `EventCallback<string>`                  | no       | —                                      |
| `DefaultValue`        | `string?`                                | no       | `"medium"` if present, else `Sizes[0]` |
| `StorageKey`          | `string?`                                | no       | `null`                                 |
| `Name`                | `string`                                 | no       | `"text-size"`                          |
| `SizeLabels`          | `IReadOnlyDictionary<string,string>`     | no       | empty                                  |
| `ChildContent`        | `RenderFragment<TextSizeChooserContext>?` | no       | the `"A"` glyph                        |
| `OnChange`            | `EventCallback<string>`                  | no       | —                                      |
| `CssClass`            | `string`                                 | no       | `""`                                   |
| `AdditionalAttributes`| `Dictionary<string,object>?`             | no       | —                                      |

`CssClass` and `AdditionalAttributes` land on the root `<div>`, not on a
form control.

There is deliberately **no** `DetectFromSystem` parameter: unlike
colour scheme and language, browsers expose no "preferred text size"
signal to detect.

## Statics

- `TextSizeChooser.LatinCapitalLetterA` — the default glyph `"A"`
  (U+0041 LATIN CAPITAL LETTER A).
- `TextSizeChooser.SizeName(slug)` — the shared title-casing rule
  (`"x-large"` → `"X Large"`). Use it when you render your own labels
  so they match the listbox exactly. Mirrors `ThemeChooser.ThemeName`
  and `Locales.LocaleName`.
- `SetSizeAsync(slug)` — apply a size imperatively via a `@ref`.

## Custom glyph

`ChildContent` replaces the glyph inside the button. It does **not**
render options — those are component-owned so the listbox semantics
cannot be broken by an override.

```razor
<TextSizeChooser Label="Text size" Sizes="sizes" @bind-Value="size">
    <ChildContent Context="ctx">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path d="M4 20 L10 4 L16 20 M6.5 14 H13.5" fill="none"
                  stroke="currentColor" stroke-width="2" />
        </svg>
    </ChildContent>
</TextSizeChooser>
```

The context carries `Value`, `Open`, and `LabelFor`. The accessible
name still comes from the button's `aria-label`, so keep `Label` set
even when supplying your own glyph.

## Keyboard

Button: `ArrowDown` / `Enter` / `Space` open on the selected option,
`ArrowUp` opens on the last. Listbox: arrows move and clamp, `Home` /
`End` jump, `Enter` / `Space` select and close, `Escape` closes without
changing the value, `Tab` closes and moves on, printable characters run
a 500 ms typeahead. Full table:
[docs/accessibility.md](./docs/accessibility.md#keyboard-contract).

## Accessibility

- WCAG 2.2 AAA target; directly supports SC 1.4.4 (Resize Text).
- WAI-ARIA APG listbox pattern with `aria-activedescendant`.
- `aria-label` is the button's entire accessible name — it is icon-only.
- The tradeoffs of a custom listbox versus a native `<select>` are
  stated plainly in [docs/accessibility.md](./docs/accessibility.md).

## Examples

See [examples/](./examples/).

## License

Dual-licensed under MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or
BSD-3-Clause. Contact joel@joelparkerhenderson.com for other terms.

---

Lily™ and Lily Design System™ are trademarks.
