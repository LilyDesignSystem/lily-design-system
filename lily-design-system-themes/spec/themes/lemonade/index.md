# Lemonade

Light theme on a pale-lime page (`#f8fdef`) with a green primary (`#419400`), olive-yellow secondary and yellow accent. Flat, 1rem radii.

## At a glance

| | |
| --- | --- |
| Slug / `data-theme` | `lemonade` |
| Stylesheet | [`themes/lemonade.css`](../../../../themes/lemonade.css) |
| Token source | [`themes/tokens/lemonade.json`](../../../../themes/tokens/lemonade.json) |
| Colour scheme | `light` |
| Group | General purpose (DaisyUI palette set) |
| Primary | `#419400` (green) |
| Page surface | `#f8fdef` |
| Body text on page surface | `#151614`, 17.5:1 |
| Text pairs at AAA (7:1) | 10 of 11 |
| Text pairs below AA (4.5:1) | 0 of 11 |

## Upstream

- **Source:** DaisyUI (https://daisyui.com/)
- **Tracks:** DaisyUI v5-era theme palette, adapted to Lily tokens and hooks.

## Palette

| Token | Value | sRGB | Role |
| --- | --- | --- | --- |
| `--color-base-100` | `oklch(98.71% 0.02 123.72)` | `#f8fdef` | page surface |
| `--color-base-200` | `oklch(91.8% 0.018 123.72)` | `#e1e6d9` | panels, cards, table headers |
| `--color-base-300` | `oklch(84.89% 0.017 123.72)` | `#cbcfc3` | dividers, hover rows, borders |
| `--color-base-content` | `oklch(19.74% 0.004 123.72)` | `#151614` | body text |
| `--color-primary` | `oklch(58.92% 0.199 134.6)` | `#419400` | primary action, focus intent |
| `--color-primary-content` | `oklch(11.78% 0.039 134.6)` | `#010800` | text on primary |
| `--color-secondary` | `oklch(77.75% 0.196 111.09)` | `#bdc000` | hover and secondary chrome |
| `--color-secondary-content` | `oklch(15.55% 0.039 111.09)` | `#0d0e00` | text on secondary |
| `--color-accent` | `oklch(85.39% 0.201 100.73)` | `#edd000` | sparing emphasis |
| `--color-accent-content` | `oklch(17.08% 0.04 100.73)` | `#141000` | text on accent |
| `--color-neutral` | `oklch(30.98% 0.075 108.6)` | `#343300` | footer, code, tooltips |
| `--color-neutral-content` | `oklch(86.2% 0.015 108.6)` | `#d2d3c7` | text on neutral |
| `--color-info` | `oklch(86.19% 0.047 224.14)` | `#b1d9e9` | informational |
| `--color-info-content` | `oklch(17.24% 0.009 224.14)` | `#0c1113` | text on info |
| `--color-success` | `oklch(86.19% 0.047 157.85)` | `#b9dbc6` | success, confirmation |
| `--color-success-content` | `oklch(17.24% 0.009 157.85)` | `#0d110e` | text on success |
| `--color-warning` | `oklch(86.19% 0.047 102.15)` | `#d7d3b0` | warning, caution |
| `--color-warning-content` | `oklch(17.24% 0.009 102.15)` | `#11100c` | text on warning |
| `--color-error` | `oklch(86.19% 0.047 25.85)` | `#efc6c2` | error, destructive |
| `--color-error-content` | `oklch(17.24% 0.009 25.85)` | `#140e0e` | text on error |

## Shape and depth

| Token | Value | Applied to |
| --- | --- | --- |
| `--radius-selector` | `1rem` (16px) | chips, badges, switches, checkbox and radio containers |
| `--radius-field` | `0.5rem` (8px) | inputs, buttons, menu items, tooltips |
| `--radius-box` | `1rem` (16px) | cards, dialogs, drawers, hero blocks |
| `--border` | `1px` | stroke weight everywhere |
| `--depth` | `0` | flat: no shadows |
| `--noise` | `0` | no texture |

## Contrast

| Pair | Ratio | Level |
| --- | ---: | --- |
| `--color-base-content` on `--color-base-100` | 17.54:1 | AAA |
| `--color-base-content` on `--color-base-200` | 14.28:1 | AAA |
| `--color-base-content` on `--color-base-300` | 11.46:1 | AAA |
| `--color-primary-content` on `--color-primary` | 5.27:1 | AA |
| `--color-secondary-content` on `--color-secondary` | 9.91:1 | AAA |
| `--color-accent-content` on `--color-accent` | 12.34:1 | AAA |
| `--color-neutral-content` on `--color-neutral` | 8.57:1 | AAA |
| `--color-info-content` on `--color-info` | 12.64:1 | AAA |
| `--color-success-content` on `--color-success` | 12.70:1 | AAA |
| `--color-warning-content` on `--color-warning` | 12.54:1 | AAA |
| `--color-error-content` on `--color-error` | 12.31:1 | AAA |

10 of 11 text pairs reach AAA (7:1). Every pair reaches at least AA (4.5:1).

## Behaviour beyond the tokens

None. This theme changes only the token block above; every component rule below it is the one all themes share, so the same markup renders in any theme and only these values differ.

## Design notes (from the stylesheet header)

Verbatim from the top of the stylesheet. File names quoted in it may predate the `for-patients` / `for-practitioners` naming.

```text
Lily theme: lemonade

Standalone Lily Design System theme — declares the theme tokens and inlines
the component CSS for all 492 Lily components, so this single file is the
only stylesheet required to render a Lily-styled page.

Credit for the theme source: DaisyUI (https://daisyui.com/)

Upstream tracked: DaisyUI v5-era theme palette, adapted to Lily tokens and hooks.
========================================================================= */

Theme tokens — the colour, radius, border, and depth variables consumed
by every Lily component rule below. The theme applies by default (`:root`)
and also when explicitly opted into via `<html data-theme="lemonade">`,
so multiple themes can coexist in one document and be switched at runtime
by updating the `data-theme` attribute. */
```

## Usage

```html
<link rel="stylesheet" href="/themes/lemonade.css" data-lily-theme-picker>
<html data-theme="lemonade">
```

`theme-picker` loads this stylesheet by swapping the managed `<link>`'s `href` and setting `data-theme="lemonade"` on the document root; `picker-bar` lists it by default. Installed from npm: `@lilydesignsystem/themes/lemonade.css`. The stylesheet is standalone: every Lily component rule is inlined, in `@layer lily` with zero-specificity `:where()` selectors, so application CSS always wins.

## Related

- [Themes index](../../index.md) — the package contract.
- [AGENTS/theme.md](../../../../AGENTS/theme.md) — token shape and the headless forbidden list.
- [spec/theme](../../../../spec/theme/index.md) — the theme topic.
- [spec/theme-picker](../../../../spec/theme-picker/index.md) — runtime switching.
