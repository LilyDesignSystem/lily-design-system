# AGENTS — ColorPicker (Blazor helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything below is a fast index.

## What this package is

A Blazor headless colour picker in four areas: recent colours, a palette (8 rows of 10 by default) with a Transparent
button, and entry fields for hex, CSS name, HSL, HSB, RGB and CMYK, with a separator between the areas. It holds a form value, as
`date-time-picker` does; it applies nothing to the document and persists nothing. It is an inline panel, not an icon button
with a popup: put it in a `popover` or `dialog` if you want one.

The canonical implementation is the Svelte package (`../lily-design-system-svelte-color-picker/`); where they disagree, Svelte
wins.

## Files

| File                            | Purpose                                                                           |
| ------------------------------- | --------------------------------------------------------------------------------- |
| `spec/index.md`                 | Specification-driven contract (canonical).                                        |
| `ColorPicker.razor`             | Markup.                                                                           |
| `ColorPicker.razor.cs`          | Code-behind: parameters, choosing, the entry fields, the row keys.                |
| `ColorPickerLabels.cs`          | The labels record.                                                                |
| `Colors.cs`                     | The colour model, a C# port of `shared/colors.ts`.                                |
| `ColorPickerTests.cs`           | bUnit tests, one or more per spec rule.                                           |
| `ColorsTests.cs`                | The C# colour model against `tests/colors-parity.json`.                           |
| `tests/write-colors-parity.mjs` | Writes `tests/colors-parity.json` from `shared/colors.ts`; rerun when it changes. |
| `index.md`                      | User guide.                                                                       |
| `docs/accessibility.md`         | Tradeoffs, stated plainly.                                                        |

## Public surface

`ColorPicker`, `ColorPickerLabels`, and the static `Colors` class (`CssNamedColors`, `CssNames`, `NormalizeHex`, the conversions,
`NameOfColor`, `DefaultPalette`, `PushRecent`) with the `Rgb`, `Hsl`, `Hsb` and `Cmyk` records. Required parameter: `Labels`.

## Rules worth knowing

- No English: every word is in `labels`; a swatch's default name is its CSS keyword or hex value, and `colorLabel` replaces it.
- Swatches are native radios with `data-color` and `--color-picker-swatch`; Up and Down move a palette row.
- `value` is lowercase `#rrggbb`, `transparent` or empty.
- The colour model is `Colors.cs`, a C# port of `shared/colors.ts`; when that changes, port it and rerun `node tests/write-colors-parity.mjs`.
