# Lily Design System™: Blazor color picker

`LilyDesignSystem.Blazor.ColorPicker` is a Blazor colour picker in four areas:

1. **Recent colours**: a row of up to ten swatches, the newest first.
2. A separator.
3. **Palette**: 8 rows of 10 swatches, and a large **Transparent** button.
4. A separator.
5. **Entry fields**: a colour by hex, by CSS colour name (the X11 names, offered from a list), and by four colour models, each
   a group of number fields: HSL (hue, saturation, lightness), HSB (hue, saturation, brightness), RGB (red, green, blue) and
   CMYK (cyan, magenta, yellow, key).

It is headless: no CSS. Every swatch is a native radio carrying `data-color` and a `--color-picker-swatch` custom property, so
your CSS paints it. It holds a form value, as `date-time-picker` does: it applies nothing to the page and stores nothing. Use
`@bind-Recent` to keep the recent colours.

## Install

```sh
dotnet add package LilyDesignSystem.Blazor.ColorPicker
```

## Usage

```razor
@using LilyDesignSystem.Blazor.Helpers

<ColorPicker Labels="_labels" @bind-Value="_colour" @bind-Recent="_recent" Name="colour" />

@code {
    private string _colour = "#005eb8";
    private IReadOnlyList<string> _recent = Array.Empty<string>();
    private readonly ColorPickerLabels _labels = new()
    {
        Picker = "Text colour", Recent = "Recent colours", Palette = "Colours", Transparent = "Transparent",
        Custom = "Custom colour", Hex = "Hex", Name = "Colour name",
        Hsl = "HSL", Hsb = "HSB", Rgb = "RGB", Cmyk = "CMYK",
        Hue = "Hue", Saturation = "Saturation", Lightness = "Lightness", Brightness = "Brightness",
        Red = "Red", Green = "Green", Blue = "Blue",
        Cyan = "Cyan", Magenta = "Magenta", Yellow = "Yellow", Key = "Black",
        Invalid = "Not a colour",
    };
}
```

## Props

| Parameter    | Type                                     | Default                   | What it does                                                           |
| ------------ | ---------------------------------------- | ------------------------- | ---------------------------------------------------------------------- |
| `Labels`     | `ColorPickerLabels`                      | required                  | Every word (required `init` properties). No English ships.             |
| `Value`      | `string` (`@bind-Value`)                 | `""`                      | `"#rrggbb"`, `"transparent"`, or `""` for none.                        |
| `Recent`     | `IReadOnlyList<string>` (`@bind-Recent`) | empty                     | Recent choices, newest first.                                          |
| `MaxRecent`  | `int`                                    | `10`                      | How many recent colours to keep.                                       |
| `Palette`    | `IReadOnlyList<string>?`                 | `Colors.DefaultPalette()` | The palette, row by row.                                               |
| `Columns`    | `int`                                    | `10`                      | Swatches per row; ArrowUp and ArrowDown move by this many.             |
| `ColorLabel` | `Func<string, string>?`                  | CSS name, else hex        | Each swatch's accessible name, in the reader's language.               |
| `Name`       | `string?`                                | none                      | Renders a hidden input, so the colour submits with a form.             |
| `Disabled`   | `bool`                                   | `false`                   | Disables every control.                                                |
| `CssClass`   | `string`                                 | `""`                      | Added to the root's class list; other attributes spread onto the root. |

`Labels` has, all required, `picker`, `recent`, `palette`, `transparent`, `custom`, `hex` and `name`; the four group names
`hsl`, `hsb`, `rgb` and `cmyk`; and the field names `hue`, `saturation`, `lightness`, `brightness`, `red`, `green`, `blue`,
`cyan`, `magenta`, `yellow` and `key`. `invalid` (optional) is the message beside a hex or name
field that holds no colour).

## Keyboard

- **Tab** moves between the recent colours, the palette, Transparent and each field.
- In the palette and the recent row, **Left** and **Right** move one swatch and choose it (the browser's radio keys).
- In the palette, **Up** and **Down** move one row.
- **Space** chooses the focused swatch; **Enter** or **Space** presses Transparent.
- In the hex and name fields, **Enter** (or leaving the field) applies what you typed.

## Styling

```css
.color-picker-swatch {
  appearance: none;
  inline-size: 1.75rem;
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--color-picker-swatch);
}
.color-picker-swatch:checked {
  box-shadow:
    0 0 0 2px Canvas,
    0 0 0 4px CanvasText;
}
.color-picker-palette-row {
  display: flex;
  gap: 0.25rem;
}
```

Class hooks: `color-picker`, `color-picker-recent`, `color-picker-separator`, `color-picker-palette`,
`color-picker-palette-row`, `color-picker-swatch`, `color-picker-transparent`, `color-picker-transparent-icon`,
`color-picker-custom`, `color-picker-field` (with `-hex`, `-name`, `-hsl`, `-hsb`, `-rgb`, `-cmyk`), `color-picker-hex`, `color-picker-name`,
`color-picker-hsl`, `color-picker-hsb`, `color-picker-rgb`, `color-picker-cmyk` (each field also `-{key}`, such as
`color-picker-cmyk-k`), `color-picker-invalid`. The root carries `data-value`.

## The colour functions

`Colors` holds the colour model in C#: `CssNamedColors` and `CssNames` (the 148 CSS names), `NormalizeHex`, `HexToRgb`, `RgbToHex`,
`RgbToHsl`, `HslToRgb`, `HexToHsl`, `HslToHex`, `RgbToHsb`, `HsbToRgb`, `HexToHsb`, `HsbToHex`, `RgbToCmyk`, `CmykToRgb`, `HexToCmyk`,
`CmykToHex`, `NameOfColor`, `DefaultPalette` and `PushRecent`. It has no `parseColor`.

## Accessibility

- The whole control is one group named by `labels.picker`; the recent row and the palette are radio groups, so a screen reader
  says, for example, "tomato, radio, 3 of 80".
- A swatch is never colour alone: each has a name, from `colorLabel`, its CSS name, or its hex value.
- The default names are CSS keywords or hex values. For people who do not read English colour words, pass `colorLabel`.
- See [docs/accessibility.md](docs/accessibility.md).

## Not included

- A two-dimensional hue and saturation board, an eyedropper, or alpha. Use the fields for an exact colour.
- Print colour management. CMYK here is the simple formula from RGB, not a conversion through a printer's colour profile.
- Storage: bind `recent` and keep it where your app keeps preferences.

## Differences from the Svelte package

- `@bind-Value` and `@bind-Recent` replace Svelte's bindable `value` and `recent`; `CssClass` replaces `class`.
- `Labels` is a `ColorPickerLabels` record with required `init` properties, so a missing word is a compile error.
- Blazor cannot decide `preventDefault` per key, so one small listener, installed through `IJSRuntime` `"eval"` after the first render, stops the browser's own ArrowUp and ArrowDown on a palette radio and Enter in the hex and name fields. No JS file ships.
- No form-reset handling: Blazor forms reset by setting the bound value.
- The colour model is `Colors.cs`, a port of `shared/colors.ts`, checked against values the TypeScript module computes.

The Svelte package (`../lily-design-system-svelte-color-picker/`) is canonical; where they disagree, Svelte wins.

---

Lily™ and Lily Design System™ are trademarks.
