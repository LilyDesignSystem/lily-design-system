# Synthwave

Dark deep-indigo page (`#09002f`) with a hot-pink primary (`#f861b4`), sky-blue secondary and orange accent. Flat, 1rem radii.

## At a glance

| | |
| --- | --- |
| Slug / `data-theme` | `synthwave` |
| Stylesheet | [`themes/synthwave.css`](../../../../themes/synthwave.css) |
| Token source | [`themes/tokens/synthwave.json`](../../../../themes/tokens/synthwave.json) |
| Colour scheme | `dark` |
| Group | General purpose (DaisyUI palette set) |
| Primary | `#f861b4` (pink) |
| Page surface | `#09002f` |
| Body text on page surface | `#a1b1ff`, 9.7:1 |
| Text pairs at AAA (7:1) | 6 of 11 |
| Text pairs below AA (4.5:1) | 0 of 11 |

## Upstream

- **Source:** DaisyUI (https://daisyui.com/)
- **Tracks:** DaisyUI v5-era theme palette, adapted to Lily tokens and hooks.

## Palette

| Token | Value | sRGB | Role |
| --- | --- | --- | --- |
| `--color-base-100` | `oklch(15% 0.09 281.288)` | `#09002f` | page surface |
| `--color-base-200` | `oklch(20% 0.09 281.288)` | `#120b3d` | panels, cards, table headers |
| `--color-base-300` | `oklch(25% 0.09 281.288)` | `#1c184b` | dividers, hover rows, borders |
| `--color-base-content` | `oklch(78% 0.115 274.713)` | `#a1b1ff` | body text |
| `--color-primary` | `oklch(71% 0.202 349.761)` | `#f861b4` | primary action, focus intent |
| `--color-primary-content` | `oklch(28% 0.109 3.907)` | `#500323` | text on primary |
| `--color-secondary` | `oklch(82% 0.111 230.318)` | `#71d1fe` | hover and secondary chrome |
| `--color-secondary-content` | `oklch(29% 0.066 243.157)` | `#042e49` | text on secondary |
| `--color-accent` | `oklch(75% 0.183 55.934)` | `#ff8904` | sparing emphasis |
| `--color-accent-content` | `oklch(26% 0.079 36.259)` | `#421104` | text on accent |
| `--color-neutral` | `oklch(45% 0.24 277.023)` | `#422ad5` | footer, code, tooltips |
| `--color-neutral-content` | `oklch(87% 0.065 274.039)` | `#c6d2ff` | text on neutral |
| `--color-info` | `oklch(74% 0.16 232.661)` | `#00bafe` | informational |
| `--color-info-content` | `oklch(29% 0.066 243.157)` | `#042e49` | text on info |
| `--color-success` | `oklch(77% 0.152 181.912)` | `#00d3bb` | success, confirmation |
| `--color-success-content` | `oklch(27% 0.046 192.524)` | `#002d2c` | text on success |
| `--color-warning` | `oklch(90% 0.182 98.111)` | `#fede1c` | warning, caution |
| `--color-warning-content` | `oklch(42% 0.095 57.708)` | `#733e0a` | text on warning |
| `--color-error` | `oklch(73.7% 0.121 32.639)` | `#ec8c78` | error, destructive |
| `--color-error-content` | `oklch(23.5% 0.096 290.329)` | `#201047` | text on error |

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
| `--color-base-content` on `--color-base-100` | 9.74:1 | AAA |
| `--color-base-content` on `--color-base-200` | 8.98:1 | AAA |
| `--color-base-content` on `--color-base-300` | 8.00:1 | AAA |
| `--color-primary-content` on `--color-primary` | 5.34:1 | AA |
| `--color-secondary-content` on `--color-secondary` | 8.21:1 | AAA |
| `--color-accent-content` on `--color-accent` | 6.72:1 | AA |
| `--color-neutral-content` on `--color-neutral` | 5.57:1 | AA |
| `--color-info-content` on `--color-info` | 6.34:1 | AA |
| `--color-success-content` on `--color-success` | 7.82:1 | AAA |
| `--color-warning-content` on `--color-warning` | 6.47:1 | AA |
| `--color-error-content` on `--color-error` | 7.00:1 | AAA |

6 of 11 text pairs reach AAA (7:1). Every pair reaches at least AA (4.5:1).

## Behaviour beyond the tokens

None. This theme changes only the token block above; every component rule below it is the one all themes share, so the same markup renders in any theme and only these values differ.

## Design notes (from the stylesheet header)

Verbatim from the top of the stylesheet. File names quoted in it may predate the `for-patients` / `for-practitioners` naming.

```text
Lily theme: synthwave

Standalone Lily Design System theme — declares the theme tokens and inlines
the component CSS for all 492 Lily components, so this single file is the
only stylesheet required to render a Lily-styled page.

Credit for the theme source: DaisyUI (https://daisyui.com/)

Upstream tracked: DaisyUI v5-era theme palette, adapted to Lily tokens and hooks.
========================================================================= */

Theme tokens — the colour, radius, border, and depth variables consumed
by every Lily component rule below. The theme applies by default (`:root`)
and also when explicitly opted into via `<html data-theme="synthwave">`,
so multiple themes can coexist in one document and be switched at runtime
by updating the `data-theme` attribute. */
```

## Usage

```html
<link rel="stylesheet" href="/themes/synthwave.css" data-lily-theme-picker>
<html data-theme="synthwave">
```

`theme-picker` loads this stylesheet by swapping the managed `<link>`'s `href` and setting `data-theme="synthwave"` on the document root; `picker-bar` lists it by default. Installed from npm: `@lilydesignsystem/themes/synthwave.css`. The stylesheet is standalone: every Lily component rule is inlined, in `@layer lily` with zero-specificity `:where()` selectors, so application CSS always wins.

## Related

- [Themes index](../../index.md) — the package contract.
- [AGENTS/theme.md](../../../../AGENTS/theme.md) — token shape and the headless forbidden list.
- [spec/theme](../../../../spec/theme/index.md) — the theme topic.
- [spec/theme-picker](../../../../spec/theme-picker/index.md) — runtime switching.
