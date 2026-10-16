# Aqua

Dark theme on a saturated navy-blue page (`#1a368b`) with a cyan primary (`#13ecf3`), purple secondary and pale-yellow accent. 1rem radii, shadows on.

## At a glance

| | |
| --- | --- |
| Slug / `data-theme` | `aqua` |
| Stylesheet | [`themes/aqua.css`](../../../../themes/aqua.css) |
| Token source | [`themes/tokens/aqua.json`](../../../../themes/tokens/aqua.json) |
| Colour scheme | `dark` |
| Group | General purpose (DaisyUI palette set) |
| Primary | `#13ecf3` (cyan) |
| Page surface | `#1a368b` |
| Body text on page surface | `#b8e6fe`, 8.1:1 |
| Text pairs at AAA (7:1) | 6 of 11 |
| Text pairs below AA (4.5:1) | 2 of 11 |

## Upstream

- **Source:** DaisyUI (https://daisyui.com/)
- **Tracks:** DaisyUI v5-era theme palette, adapted to Lily tokens and hooks.

## Palette

| Token | Value | sRGB | Role |
| --- | --- | --- | --- |
| `--color-base-100` | `oklch(37% 0.146 265.522)` | `#1a368b` | page surface |
| `--color-base-200` | `oklch(28% 0.091 267.935)` | `#162455` | panels, cards, table headers |
| `--color-base-300` | `oklch(22% 0.091 267.935)` | `#091444` | dividers, hover rows, borders |
| `--color-base-content` | `oklch(90% 0.058 230.902)` | `#b8e6fe` | body text |
| `--color-primary` | `oklch(85.66% 0.144 198.645)` | `#13ecf3` | primary action, focus intent |
| `--color-primary-content` | `oklch(40.12% 0.068 197.603)` | `#015355` | text on primary |
| `--color-secondary` | `oklch(60.68% 0.108 309.782)` | `#966fb3` | hover and secondary chrome |
| `--color-secondary-content` | `oklch(96% 0.016 293.756)` | `#f2f0fc` | text on secondary |
| `--color-accent` | `oklch(93.43% 0.102 94.555)` | `#ffe999` | sparing emphasis |
| `--color-accent-content` | `oklch(18.68% 0.02 94.555)` | `#161309` | text on accent |
| `--color-neutral` | `oklch(27% 0.146 265.522)` | `#05176c` | footer, code, tooltips |
| `--color-neutral-content` | `oklch(80% 0.146 265.522)` | `#90baff` | text on neutral |
| `--color-info` | `oklch(54.62% 0.215 262.88)` | `#2563eb` | informational |
| `--color-info-content` | `oklch(90.92% 0.043 262.88)` | `#d2e2ff` | text on info |
| `--color-success` | `oklch(62.7% 0.169 149.213)` | `#18a34a` | success, confirmation |
| `--color-success-content` | `oklch(12.54% 0.033 149.213)` | `#000a02` | text on success |
| `--color-warning` | `oklch(66.58% 0.157 58.318)` | `#d97708` | warning, caution |
| `--color-warning-content` | `oklch(27% 0.077 45.635)` | `#431700` | text on warning |
| `--color-error` | `oklch(73.95% 0.19 27.33)` | `#ff7265` | error, destructive |
| `--color-error-content` | `oklch(14.79% 0.038 27.33)` | `#180403` | text on error |

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
| `--color-base-content` on `--color-base-100` | 8.12:1 | AAA |
| `--color-base-content` on `--color-base-200` | 11.14:1 | AAA |
| `--color-base-content` on `--color-base-300` | 13.21:1 | AAA |
| `--color-primary-content` on `--color-primary` | 6.04:1 | AA |
| `--color-secondary-content` on `--color-secondary` | 3.57:1 | AA large |
| `--color-accent-content` on `--color-accent` | 15.35:1 | AAA |
| `--color-neutral-content` on `--color-neutral` | 7.92:1 | AAA |
| `--color-info-content` on `--color-info` | 3.95:1 | AA large |
| `--color-success-content` on `--color-success` | 6.11:1 | AA |
| `--color-warning-content` on `--color-warning` | 4.84:1 | AA |
| `--color-error-content` on `--color-error` | 7.42:1 | AAA |

6 of 11 text pairs reach AAA (7:1). Below AA (4.5:1): `--color-secondary-content` on `--color-secondary` 3.57:1; `--color-info-content` on `--color-info` 3.95:1. These are the theme author's colours; Lily never rewrites them, and `bin/check-theme --contrast` reports the same pairs.

## Behaviour beyond the tokens

None. This theme changes only the token block above; every component rule below it is the one all themes share, so the same markup renders in any theme and only these values differ.

## Design notes (from the stylesheet header)

Verbatim from the top of the stylesheet. File names quoted in it may predate the `for-patients` / `for-practitioners` naming.

```text
Lily theme: aqua

Standalone Lily Design System theme — declares the theme tokens and inlines
the component CSS for all 492 Lily components, so this single file is the
only stylesheet required to render a Lily-styled page.

Credit for the theme source: DaisyUI (https://daisyui.com/)

Upstream tracked: DaisyUI v5-era theme palette, adapted to Lily tokens and hooks.
========================================================================= */

Theme tokens — the colour, radius, border, and depth variables consumed
by every Lily component rule below. The theme applies by default (`:root`)
and also when explicitly opted into via `<html data-theme="aqua">`,
so multiple themes can coexist in one document and be switched at runtime
by updating the `data-theme` attribute. */
```

## Usage

```html
<link rel="stylesheet" href="/themes/aqua.css" data-lily-theme-picker>
<html data-theme="aqua">
```

`theme-picker` loads this stylesheet by swapping the managed `<link>`'s `href` and setting `data-theme="aqua"` on the document root; `picker-bar` lists it by default. Installed from npm: `@lilydesignsystem/themes/aqua.css`. The stylesheet is standalone: every Lily component rule is inlined, in `@layer lily` with zero-specificity `:where()` selectors, so application CSS always wins.

## Related

- [Themes index](../../index.md) — the package contract.
- [AGENTS/theme.md](../../../../AGENTS/theme.md) — token shape and the headless forbidden list.
- [spec/theme](../../../../spec/theme/index.md) — the theme topic.
- [spec/theme-picker](../../../../spec/theme-picker/index.md) — runtime switching.
