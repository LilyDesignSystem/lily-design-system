# Acid

Light theme on a near-white page (`#f8f8f8`) with fully saturated colour: magenta primary (`#ff00ff`), orange secondary and lime accent, 1rem radii throughout. Loud by design; check text on the brighter fills.

## At a glance

| | |
| --- | --- |
| Slug / `data-theme` | `acid` |
| Stylesheet | [`themes/acid.css`](../../../../themes/acid.css) |
| Token source | [`themes/tokens/acid.json`](../../../../themes/tokens/acid.json) |
| Colour scheme | `light` |
| Group | General purpose (DaisyUI palette set) |
| Primary | `#ff00ff` (purple) |
| Page surface | `#f8f8f8` |
| Body text on page surface | `#000000`, 19.8:1 |
| Text pairs at AAA (7:1) | 8 of 11 |
| Text pairs below AA (4.5:1) | 0 of 11 |

## Upstream

- **Source:** DaisyUI (https://daisyui.com/)
- **Tracks:** DaisyUI v5-era theme palette, adapted to Lily tokens and hooks.

## Palette

| Token | Value | sRGB | Role |
| --- | --- | --- | --- |
| `--color-base-100` | `oklch(98% 0 0)` | `#f8f8f8` | page surface |
| `--color-base-200` | `oklch(95% 0 0)` | `#eeeeee` | panels, cards, table headers |
| `--color-base-300` | `oklch(91% 0 0)` | `#e1e1e1` | dividers, hover rows, borders |
| `--color-base-content` | `oklch(0% 0 0)` | `#000000` | body text |
| `--color-primary` | `oklch(71.9% 0.357 330.759)` | `#ff00ff` | primary action, focus intent |
| `--color-primary-content` | `oklch(14.38% 0.071 330.759)` | `#180017` | text on primary |
| `--color-secondary` | `oklch(73.37% 0.224 48.25)` | `#ff6e00` | hover and secondary chrome |
| `--color-secondary-content` | `oklch(14.67% 0.044 48.25)` | `#180400` | text on secondary |
| `--color-accent` | `oklch(92.78% 0.264 122.962)` | `#c8ff00` | sparing emphasis |
| `--color-accent-content` | `oklch(18.56% 0.052 122.962)` | `#0f1600` | text on accent |
| `--color-neutral` | `oklch(21.31% 0.128 278.68)` | `#140151` | footer, code, tooltips |
| `--color-neutral-content` | `oklch(84.26% 0.025 278.68)` | `#c7cadc` | text on neutral |
| `--color-info` | `oklch(60.72% 0.227 252.05)` | `#007fff` | informational |
| `--color-info-content` | `oklch(12.14% 0.045 252.05)` | `#000616` | text on info |
| `--color-success` | `oklch(85.72% 0.266 158.53)` | `#00ff8a` | success, confirmation |
| `--color-success-content` | `oklch(17.14% 0.053 158.53)` | `#001607` | text on success |
| `--color-warning` | `oklch(91.01% 0.212 100.5)` | `#ffe200` | warning, caution |
| `--color-warning-content` | `oklch(18.2% 0.042 100.5)` | `#161200` | text on warning |
| `--color-error` | `oklch(64.84% 0.293 29.349)` | `#ff0000` | error, destructive |
| `--color-error-content` | `oklch(12.97% 0.058 29.349)` | `#190000` | text on error |

## Shape and depth

| Token | Value | Applied to |
| --- | --- | --- |
| `--radius-selector` | `1rem` (16px) | chips, badges, switches, checkbox and radio containers |
| `--radius-field` | `1rem` (16px) | inputs, buttons, menu items, tooltips |
| `--radius-box` | `1rem` (16px) | cards, dialogs, drawers, hero blocks |
| `--border` | `1px` | stroke weight everywhere |
| `--depth` | `1` | shadows on |
| `--noise` | `0` | no texture |

## Contrast

| Pair | Ratio | Level |
| --- | ---: | --- |
| `--color-base-content` on `--color-base-100` | 19.77:1 | AAA |
| `--color-base-content` on `--color-base-200` | 18.10:1 | AAA |
| `--color-base-content` on `--color-base-300` | 16.06:1 | AAA |
| `--color-primary-content` on `--color-primary` | 6.37:1 | AA |
| `--color-secondary-content` on `--color-secondary` | 7.08:1 | AAA |
| `--color-accent-content` on `--color-accent` | 15.65:1 | AAA |
| `--color-neutral-content` on `--color-neutral` | 11.20:1 | AAA |
| `--color-info-content` on `--color-info` | 5.28:1 | AA |
| `--color-success-content` on `--color-success` | 14.02:1 | AAA |
| `--color-warning-content` on `--color-warning` | 14.39:1 | AAA |
| `--color-error-content` on `--color-error` | 5.04:1 | AA |

8 of 11 text pairs reach AAA (7:1). Every pair reaches at least AA (4.5:1).

## Behaviour beyond the tokens

None. This theme changes only the token block above; every component rule below it is the one all themes share, so the same markup renders in any theme and only these values differ.

## Design notes (from the stylesheet header)

Verbatim from the top of the stylesheet. File names quoted in it may predate the `for-patients` / `for-practitioners` naming.

```text
Lily theme: acid

Standalone Lily Design System theme — declares the theme tokens and inlines
the component CSS for all 492 Lily components, so this single file is the
only stylesheet required to render a Lily-styled page.

Credit for the theme source: DaisyUI (https://daisyui.com/)

Upstream tracked: DaisyUI v5-era theme palette, adapted to Lily tokens and hooks.
========================================================================= */

Theme tokens — the colour, radius, border, and depth variables consumed
by every Lily component rule below. The theme applies by default (`:root`)
and also when explicitly opted into via `<html data-theme="acid">`,
so multiple themes can coexist in one document and be switched at runtime
by updating the `data-theme` attribute. */
```

## Usage

```html
<link rel="stylesheet" href="/themes/acid.css" data-lily-theme-picker>
<html data-theme="acid">
```

`theme-picker` loads this stylesheet by swapping the managed `<link>`'s `href` and setting `data-theme="acid"` on the document root; `picker-bar` lists it by default. Installed from npm: `@lilydesignsystem/themes/acid.css`. The stylesheet is standalone: every Lily component rule is inlined, in `@layer lily` with zero-specificity `:where()` selectors, so application CSS always wins.

## Related

- [Themes index](../../index.md) — the package contract.
- [AGENTS/theme.md](../../../../AGENTS/theme.md) — token shape and the headless forbidden list.
- [spec/theme](../../../../spec/theme/index.md) — the theme topic.
- [spec/theme-picker](../../../../spec/theme-picker/index.md) — runtime switching.
