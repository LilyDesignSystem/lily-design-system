# AGENTS — ColorPicker (Svelte helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything below is a fast index.

## What this package is

A Svelte 5 headless colour picker in four areas: recent colours, a palette (8 rows of 10 by default) with a Transparent
button, and entry fields for hex, CSS name, HSL, HSB, RGB and CMYK, with a separator between the areas. It holds a form value, as
`date-time-picker` does; it applies nothing to the document and persists nothing. It is an inline panel, not an icon button
with a popup: put it in a `popover` or `dialog` if you want one.

## Files

| File                    | Purpose                                                     |
| ----------------------- | ----------------------------------------------------------- |
| `spec/index.md`         | Specification-driven contract (canonical).                  |
| `ColorPicker.svelte`    | Implementation. Svelte 5 runes + TypeScript.                |
| `colors.ts`             | The pure colour model: parsing, conversion, names, palette. |
| `ColorPicker.test.ts`   | Component tests, one or more per spec rule.                 |
| `colors.test.ts`        | Colour-model tests.                                         |
| `index.ts`              | Barrel re-export.                                           |
| `index.md`              | User guide.                                                 |
| `docs/accessibility.md` | Tradeoffs, stated plainly.                                  |

## Public surface

Default export `ColorPicker`; named `ColorPicker`, `nextColorPickerId` and the colour functions in `colors.ts`; types `Props`,
`Labels`, `Rgb`, `Hsl`, `Hsb`, `Cmyk`. Required prop: `labels`.

## Rules worth knowing

- No English: every word is in `labels`; a swatch's default name is its CSS keyword or hex value, and `colorLabel` replaces it.
- Swatches are native radios with `data-color` and `--color-picker-swatch`; Up and Down move a palette row.
- `value` is lowercase `#rrggbb`, `transparent` or empty.
- Svelte only for now; ports follow this package, not the other way round.
