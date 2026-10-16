# Autumn

Light theme on a warm grey page (`#f1f1f1`) with a deep red primary (`#8c0327`), a coral secondary and a tan accent. Soft 1rem box radius.

## At a glance

| | |
| --- | --- |
| Slug / `data-theme` | `autumn` |
| Stylesheet | [`themes/autumn.css`](../../../../themes/autumn.css) |
| Token source | [`themes/tokens/autumn.json`](../../../../themes/tokens/autumn.json) |
| Colour scheme | `light` |
| Group | General purpose (DaisyUI palette set) |
| Primary | `#8c0327` (red) |
| Page surface | `#f1f1f1` |
| Body text on page surface | `#141414`, 16.3:1 |
| Text pairs at AAA (7:1) | 6 of 11 |
| Text pairs below AA (4.5:1) | 2 of 11 |

## Upstream

- **Source:** DaisyUI (https://daisyui.com/)
- **Tracks:** DaisyUI v5-era theme palette, adapted to Lily tokens and hooks.

## Palette

| Token | Value | sRGB | Role |
| --- | --- | --- | --- |
| `--color-base-100` | `oklch(95.81% 0 0)` | `#f1f1f1` | page surface |
| `--color-base-200` | `oklch(89.11% 0 0)` | `#dbdbdb` | panels, cards, table headers |
| `--color-base-300` | `oklch(82.4% 0 0)` | `#c5c5c5` | dividers, hover rows, borders |
| `--color-base-content` | `oklch(19.16% 0 0)` | `#141414` | body text |
| `--color-primary` | `oklch(40.72% 0.161 17.53)` | `#8c0327` | primary action, focus intent |
| `--color-primary-content` | `oklch(88.14% 0.032 17.53)` | `#edd0d0` | text on primary |
| `--color-secondary` | `oklch(61.68% 0.169 23.865)` | `#d85251` | hover and secondary chrome |
| `--color-secondary-content` | `oklch(12.34% 0.033 23.865)` | `#110202` | text on secondary |
| `--color-accent` | `oklch(73.42% 0.094 60.729)` | `#d59b6b` | sparing emphasis |
| `--color-accent-content` | `oklch(14.69% 0.018 60.729)` | `#100904` | text on accent |
| `--color-neutral` | `oklch(54.37% 0.037 51.902)` | `#826a5c` | footer, code, tooltips |
| `--color-neutral-content` | `oklch(90.87% 0.007 51.902)` | `#e5e0dd` | text on neutral |
| `--color-info` | `oklch(69.22% 0.097 207.284)` | `#44adbb` | informational |
| `--color-info-content` | `oklch(13.84% 0.019 207.284)` | `#020b0d` | text on info |
| `--color-success` | `oklch(60.99% 0.08 174.616)` | `#499380` | success, confirmation |
| `--color-success-content` | `oklch(12.2% 0.016 174.616)` | `#020806` | text on success |
| `--color-warning` | `oklch(70.08% 0.164 56.844)` | `#e97f16` | warning, caution |
| `--color-warning-content` | `oklch(14.02% 0.032 56.844)` | `#130600` | text on warning |
| `--color-error` | `oklch(53.07% 0.241 24.16)` | `#d40014` | error, destructive |
| `--color-error-content` | `oklch(90.61% 0.048 24.16)` | `#ffd4d1` | text on error |

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
| `--color-base-content` on `--color-base-100` | 16.31:1 | AAA |
| `--color-base-content` on `--color-base-200` | 13.31:1 | AAA |
| `--color-base-content` on `--color-base-300` | 10.67:1 | AAA |
| `--color-primary-content` on `--color-primary` | 6.74:1 | AA |
| `--color-secondary-content` on `--color-secondary` | 5.08:1 | AA |
| `--color-accent-content` on `--color-accent` | 8.21:1 | AAA |
| `--color-neutral-content` on `--color-neutral` | 3.85:1 | AA large |
| `--color-info-content` on `--color-info` | 7.52:1 | AAA |
| `--color-success-content` on `--color-success` | 5.55:1 | AA |
| `--color-warning-content` on `--color-warning` | 7.13:1 | AAA |
| `--color-error-content` on `--color-error` | 4.09:1 | AA large |

6 of 11 text pairs reach AAA (7:1). Below AA (4.5:1): `--color-neutral-content` on `--color-neutral` 3.85:1; `--color-error-content` on `--color-error` 4.09:1. These are the theme author's colours; Lily never rewrites them, and `bin/check-theme --contrast` reports the same pairs.

## Behaviour beyond the tokens

None. This theme changes only the token block above; every component rule below it is the one all themes share, so the same markup renders in any theme and only these values differ.

## Design notes (from the stylesheet header)

Verbatim from the top of the stylesheet. File names quoted in it may predate the `for-patients` / `for-practitioners` naming.

```text
Lily theme: autumn

Standalone Lily Design System theme — declares the theme tokens and inlines
the component CSS for all 492 Lily components, so this single file is the
only stylesheet required to render a Lily-styled page.

Credit for the theme source: DaisyUI (https://daisyui.com/)

Upstream tracked: DaisyUI v5-era theme palette, adapted to Lily tokens and hooks.
========================================================================= */

Theme tokens — the colour, radius, border, and depth variables consumed
by every Lily component rule below. The theme applies by default (`:root`)
and also when explicitly opted into via `<html data-theme="autumn">`,
so multiple themes can coexist in one document and be switched at runtime
by updating the `data-theme` attribute. */
```

## Usage

```html
<link rel="stylesheet" href="/themes/autumn.css" data-lily-theme-picker>
<html data-theme="autumn">
```

`theme-picker` loads this stylesheet by swapping the managed `<link>`'s `href` and setting `data-theme="autumn"` on the document root; `picker-bar` lists it by default. Installed from npm: `@lilydesignsystem/themes/autumn.css`. The stylesheet is standalone: every Lily component rule is inlined, in `@layer lily` with zero-specificity `:where()` selectors, so application CSS always wins.

## Related

- [Themes index](../../index.md) — the package contract.
- [AGENTS/theme.md](../../../../AGENTS/theme.md) — token shape and the headless forbidden list.
- [spec/theme](../../../../spec/theme/index.md) — the theme topic.
- [spec/theme-picker](../../../../spec/theme-picker/index.md) — runtime switching.
