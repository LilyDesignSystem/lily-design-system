# AGENTS — ColorPicker (Nunjucks helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything below is a fast index.

## What this package is

A Nunjucks headless colour picker in four areas: recent colours, a palette (8 rows of 10 by default) with a Transparent
button, and entry fields for hex, CSS name, HSL, HSB, RGB and CMYK, with a separator between the areas. It holds a form value, as
`date-time-picker` does; it applies nothing to the document and persists nothing. It is an inline panel, not an icon button
with a popup: put it in a `popover` or `dialog` if you want one.

The canonical implementation is the Svelte package (`../lily-design-system-svelte-color-picker/`); where they disagree, Svelte
wins.

## Files

| File                     | Purpose                                                                                                                           |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| `spec/index.md`          | Specification-driven contract (canonical).                                                                                        |
| `color-picker.njk`       | The macro. Embeds the CSS names and default palette, checked against `colors.js` by the tests.                                    |
| `color-picker.client.js` | The client behaviour: `initColorPicker`, `autoInit`.                                                                              |
| `colors.js`              | The pure colour model. **Generated from `shared/colors.ts` (types stripped) by `bin/sync-shared-modules`; never edit this copy.** |
| `color-picker.test.ts`   | Vitest + jsdom spec, rendering the macro.                                                                                         |
| `index.md`               | User guide.                                                                                                                       |
| `docs/accessibility.md`  | Tradeoffs, stated plainly.                                                                                                        |

## Public surface

The `colorPicker` macro (`./template`); from the script, `initColorPicker`, `autoInit` and the colour functions in `colors.js`.
Required option: `labels`.

## Rules worth knowing

- No English: every word is in `labels`; a swatch's default name is its CSS keyword or hex value, and `colorLabel` replaces it.
- Swatches are native radios with `data-color` and `--color-picker-swatch`; Up and Down move a palette row.
- `value` is lowercase `#rrggbb`, `transparent` or empty.
- The colour model is `shared/colors.ts`, copied by `bin/sync-shared-modules`: edit `shared/`, never this package's copy.
