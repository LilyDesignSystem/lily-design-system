# Bumblebee

Light theme on white with a yellow primary (`#fdc700`), an orange secondary and a black accent. Friendly 1rem box radius, shadows on.

## At a glance

| | |
| --- | --- |
| Slug / `data-theme` | `bumblebee` |
| Stylesheet | [`themes/bumblebee.css`](../../../../themes/bumblebee.css) |
| Token source | [`themes/tokens/bumblebee.json`](../../../../themes/tokens/bumblebee.json) |
| Colour scheme | `light` |
| Group | General purpose (DaisyUI palette set) |
| Primary | `#fdc700` (yellow) |
| Page surface | `#ffffff` |
| Body text on page surface | `#161616`, 18.1:1 |
| Text pairs at AAA (7:1) | 5 of 11 |
| Text pairs below AA (4.5:1) | 3 of 11 |

## Upstream

- **Source:** DaisyUI (https://daisyui.com/)
- **Tracks:** DaisyUI v5-era theme palette, adapted to Lily tokens and hooks.

## Palette

| Token | Value | sRGB | Role |
| --- | --- | --- | --- |
| `--color-base-100` | `oklch(100% 0 0)` | `#ffffff` | page surface |
| `--color-base-200` | `oklch(97% 0 0)` | `#f5f5f5` | panels, cards, table headers |
| `--color-base-300` | `oklch(92% 0 0)` | `#e4e4e4` | dividers, hover rows, borders |
| `--color-base-content` | `oklch(20% 0 0)` | `#161616` | body text |
| `--color-primary` | `oklch(85% 0.199 91.936)` | `#fdc700` | primary action, focus intent |
| `--color-primary-content` | `oklch(42% 0.095 57.708)` | `#733e0a` | text on primary |
| `--color-secondary` | `oklch(75% 0.183 55.934)` | `#ff8904` | hover and secondary chrome |
| `--color-secondary-content` | `oklch(40% 0.123 38.172)` | `#7c2808` | text on secondary |
| `--color-accent` | `oklch(0% 0 0)` | `#000000` | sparing emphasis |
| `--color-accent-content` | `oklch(100% 0 0)` | `#ffffff` | text on accent |
| `--color-neutral` | `oklch(37% 0.01 67.558)` | `#433f3a` | footer, code, tooltips |
| `--color-neutral-content` | `oklch(92% 0.003 48.717)` | `#e6e4e3` | text on neutral |
| `--color-info` | `oklch(74% 0.16 232.661)` | `#00bafe` | informational |
| `--color-info-content` | `oklch(39% 0.09 240.876)` | `#014a70` | text on info |
| `--color-success` | `oklch(76% 0.177 163.223)` | `#00d390` | success, confirmation |
| `--color-success-content` | `oklch(37% 0.077 168.94)` | `#004c39` | text on success |
| `--color-warning` | `oklch(82% 0.189 84.429)` | `#fcb700` | warning, caution |
| `--color-warning-content` | `oklch(41% 0.112 45.904)` | `#793205` | text on warning |
| `--color-error` | `oklch(70% 0.191 22.216)` | `#ff6266` | error, destructive |
| `--color-error-content` | `oklch(39% 0.141 25.723)` | `#801518` | text on error |

## Shape and depth

| Token | Value | Applied to |
| --- | --- | --- |
| `--radius-selector` | `1rem` (16px) | chips, badges, switches, checkbox and radio containers |
| `--radius-field` | `0.5rem` (8px) | inputs, buttons, menu items, tooltips |
| `--radius-box` | `1rem` (16px) | cards, dialogs, drawers, hero blocks |
| `--border` | `1px` | stroke weight everywhere |
| `--depth` | `1` | shadows on |
| `--noise` | `0` | no texture |

## Contrast

| Pair | Ratio | Level |
| --- | ---: | --- |
| `--color-base-content` on `--color-base-100` | 18.10:1 | AAA |
| `--color-base-content` on `--color-base-200` | 16.60:1 | AAA |
| `--color-base-content` on `--color-base-300` | 14.23:1 | AAA |
| `--color-primary-content` on `--color-primary` | 5.51:1 | AA |
| `--color-secondary-content` on `--color-secondary` | 4.08:1 | AA large |
| `--color-accent-content` on `--color-accent` | 21.00:1 | AAA |
| `--color-neutral-content` on `--color-neutral` | 8.24:1 | AAA |
| `--color-info-content` on `--color-info` | 4.27:1 | AA large |
| `--color-success-content` on `--color-success` | 5.12:1 | AA |
| `--color-warning-content` on `--color-warning` | 5.24:1 | AA |
| `--color-error-content` on `--color-error` | 3.53:1 | AA large |

5 of 11 text pairs reach AAA (7:1). Below AA (4.5:1): `--color-secondary-content` on `--color-secondary` 4.08:1; `--color-info-content` on `--color-info` 4.27:1; `--color-error-content` on `--color-error` 3.53:1. These are the theme author's colours; Lily never rewrites them, and `bin/check-theme --contrast` reports the same pairs.

## Behaviour beyond the tokens

None. This theme changes only the token block above; every component rule below it is the one all themes share, so the same markup renders in any theme and only these values differ.

## Design notes (from the stylesheet header)

Verbatim from the top of the stylesheet. File names quoted in it may predate the `for-patients` / `for-practitioners` naming.

```text
Lily theme: bumblebee

Standalone Lily Design System theme — declares the theme tokens and inlines
the component CSS for all 492 Lily components, so this single file is the
only stylesheet required to render a Lily-styled page.

Credit for the theme source: DaisyUI (https://daisyui.com/)

Upstream tracked: DaisyUI v5-era theme palette, adapted to Lily tokens and hooks.
========================================================================= */

Theme tokens — the colour, radius, border, and depth variables consumed
by every Lily component rule below. The theme applies by default (`:root`)
and also when explicitly opted into via `<html data-theme="bumblebee">`,
so multiple themes can coexist in one document and be switched at runtime
by updating the `data-theme` attribute. */
```

## Usage

```html
<link rel="stylesheet" href="/themes/bumblebee.css" data-lily-theme-picker>
<html data-theme="bumblebee">
```

`theme-picker` loads this stylesheet by swapping the managed `<link>`'s `href` and setting `data-theme="bumblebee"` on the document root; `picker-bar` lists it by default. Installed from npm: `@lilydesignsystem/themes/bumblebee.css`. The stylesheet is standalone: every Lily component rule is inlined, in `@layer lily` with zero-specificity `:where()` selectors, so application CSS always wins.

## Related

- [Themes index](../../index.md) — the package contract.
- [AGENTS/theme.md](../../../../AGENTS/theme.md) — token shape and the headless forbidden list.
- [spec/theme](../../../../spec/theme/index.md) — the theme topic.
- [spec/theme-picker](../../../../spec/theme-picker/index.md) — runtime switching.
