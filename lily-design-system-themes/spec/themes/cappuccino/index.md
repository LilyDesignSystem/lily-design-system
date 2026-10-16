# Cappuccino

A Lily original in the warm coffee family: a cream "foam" page (`#fbf6ef`), crema panels (`#f1e7db`), espresso text (`#3b2a20`) with a coffee-brown primary (`#6f4e37`), cocoa secondary and caramel accent. Soft 8px fields and a 16px box radius. It sits beside `coffee` (dark) and `caramellatte` (cream) as the milky middle.

## At a glance

| | |
| --- | --- |
| Slug / `data-theme` | `cappuccino` |
| Stylesheet | [`themes/cappuccino.css`](../../../../themes/cappuccino.css) |
| Token source | [`themes/tokens/cappuccino.json`](../../../../themes/tokens/cappuccino.json) |
| Colour scheme | `light` |
| Group | Lily original |
| Primary | `#6f4e37` (yellow) |
| Page surface | `#fbf6ef` |
| Body text on page surface | `#3b2a20`, 12.7:1 |
| Text pairs at AAA (7:1) | 5 of 11 |
| Text pairs below AA (4.5:1) | 0 of 11 |

## Upstream

- **Source:** Cappuccino (Lily original)
- **Tracks:** Lily original (2026), in the warm family of coffee and caramellatte; no external design system.

## Palette

| Token | Value | sRGB | Role |
| --- | --- | --- | --- |
| `--color-base-100` | `#fbf6ef` | `#fbf6ef` | page surface |
| `--color-base-200` | `#f1e7db` | `#f1e7db` | panels, cards, table headers |
| `--color-base-300` | `#dfd0bf` | `#dfd0bf` | dividers, hover rows, borders |
| `--color-base-content` | `#3b2a20` | `#3b2a20` | body text |
| `--color-primary` | `#6f4e37` | `#6f4e37` | primary action, focus intent |
| `--color-primary-content` | `#ffffff` | `#ffffff` | text on primary |
| `--color-secondary` | `#9b6c48` | `#9b6c48` | hover and secondary chrome |
| `--color-secondary-content` | `#ffffff` | `#ffffff` | text on secondary |
| `--color-accent` | `#c98b4a` | `#c98b4a` | sparing emphasis |
| `--color-accent-content` | `#3b2a20` | `#3b2a20` | text on accent |
| `--color-neutral` | `#3b2a20` | `#3b2a20` | footer, code, tooltips |
| `--color-neutral-content` | `#ffffff` | `#ffffff` | text on neutral |
| `--color-info` | `#4a7c8c` | `#4a7c8c` | informational |
| `--color-info-content` | `#ffffff` | `#ffffff` | text on info |
| `--color-success` | `#548244` | `#548244` | success, confirmation |
| `--color-success-content` | `#ffffff` | `#ffffff` | text on success |
| `--color-warning` | `#d99a2b` | `#d99a2b` | warning, caution |
| `--color-warning-content` | `#3b2a20` | `#3b2a20` | text on warning |
| `--color-error` | `#b3452f` | `#b3452f` | error, destructive |
| `--color-error-content` | `#ffffff` | `#ffffff` | text on error |

## Shape and depth

| Token | Value | Applied to |
| --- | --- | --- |
| `--radius-selector` | `0.5rem` (8px) | chips, badges, switches, checkbox and radio containers |
| `--radius-field` | `0.5rem` (8px) | inputs, buttons, menu items, tooltips |
| `--radius-box` | `1rem` (16px) | cards, dialogs, drawers, hero blocks |
| `--border` | `1px` | stroke weight everywhere |
| `--depth` | `1` | shadows on |
| `--noise` | `0` | no texture |

## Contrast

| Pair | Ratio | Level |
| --- | ---: | --- |
| `--color-base-content` on `--color-base-100` | 12.70:1 | AAA |
| `--color-base-content` on `--color-base-200` | 11.18:1 | AAA |
| `--color-base-content` on `--color-base-300` | 9.05:1 | AAA |
| `--color-primary-content` on `--color-primary` | 7.44:1 | AAA |
| `--color-secondary-content` on `--color-secondary` | 4.53:1 | AA |
| `--color-accent-content` on `--color-accent` | 4.73:1 | AA |
| `--color-neutral-content` on `--color-neutral` | 13.65:1 | AAA |
| `--color-info-content` on `--color-info` | 4.61:1 | AA |
| `--color-success-content` on `--color-success` | 4.51:1 | AA |
| `--color-warning-content` on `--color-warning` | 5.60:1 | AA |
| `--color-error-content` on `--color-error` | 5.51:1 | AA |

5 of 11 text pairs reach AAA (7:1). Every pair reaches at least AA (4.5:1).

## Adjustments to the source colours

- `secondary`: source `#a47551` could not carry `#ffffff` text at 4.5:1, so it is moved along lightness (hue and chroma kept) to `#9b6c48` (4.53:1).
- `success`: source `#5b8a4b` could not carry `#ffffff` text at 4.5:1, so it is moved along lightness (hue and chroma kept) to `#548244` (4.51:1).

## Behaviour beyond the tokens

None. This theme changes only the token block above; every component rule below it is the one all themes share, so the same markup renders in any theme and only these values differ.

## Design notes (from the stylesheet header)

Verbatim from the top of the stylesheet. File names quoted in it may predate the `for-patients` / `for-practitioners` naming.

```text
Lily theme: cappuccino

Standalone Lily Design System theme — declares the theme tokens and inlines
the component CSS for all 492 Lily components, so this single file is the
only stylesheet required to render a Lily-styled page.

Credit for the theme source: Cappuccino (Lily original)

Upstream tracked: Lily original (2026), in the warm family of coffee and caramellatte; no external design system.
========================================================================= */

Theme tokens — the colour, radius, border, and depth variables consumed
by every Lily component rule below. The theme applies by default (`:root`)
and also when explicitly opted into via `<html data-theme="light">`,
so multiple themes can coexist in one document and be switched at runtime
by updating the `data-theme` attribute. */
```

## Usage

```html
<link rel="stylesheet" href="/themes/cappuccino.css" data-lily-theme-picker>
<html data-theme="cappuccino">
```

`theme-picker` loads this stylesheet by swapping the managed `<link>`'s `href` and setting `data-theme="cappuccino"` on the document root; `picker-bar` lists it by default. Installed from npm: `@lilydesignsystem/themes/cappuccino.css`. The stylesheet is standalone: every Lily component rule is inlined, in `@layer lily` with zero-specificity `:where()` selectors, so application CSS always wins.

## Related

- [Themes index](../../index.md) — the package contract.
- [AGENTS/theme.md](../../../../AGENTS/theme.md) — token shape and the headless forbidden list.
- [spec/theme](../../../../spec/theme/index.md) — the theme topic.
- [spec/theme-picker](../../../../spec/theme-picker/index.md) — runtime switching.
