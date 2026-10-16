# Cyberpunk

Light theme on a bright yellow page (`#fff248`) with a pink primary, cyan secondary and violet accent. Square corners and no shadows. Very high chroma, so check every pair.

## At a glance

| | |
| --- | --- |
| Slug / `data-theme` | `cyberpunk` |
| Stylesheet | [`themes/cyberpunk.css`](../../../../themes/cyberpunk.css) |
| Token source | [`themes/tokens/cyberpunk.json`](../../../../themes/tokens/cyberpunk.json) |
| Colour scheme | `light` |
| Group | General purpose (DaisyUI palette set) |
| Primary | `#ff6596` (red) |
| Page surface | `#fff248` |
| Body text on page surface | `#000000`, 18.0:1 |
| Text pairs at AAA (7:1) | 9 of 11 |
| Text pairs below AA (4.5:1) | 0 of 11 |

## Upstream

- **Source:** DaisyUI (https://daisyui.com/)
- **Tracks:** DaisyUI v5-era theme palette, adapted to Lily tokens and hooks.

## Palette

| Token | Value | sRGB | Role |
| --- | --- | --- | --- |
| `--color-base-100` | `oklch(94.51% 0.179 104.32)` | `#fff248` | page surface |
| `--color-base-200` | `oklch(91.51% 0.179 104.32)` | `#f7e83a` | panels, cards, table headers |
| `--color-base-300` | `oklch(85.51% 0.179 104.32)` | `#e3d40e` | dividers, hover rows, borders |
| `--color-base-content` | `oklch(0% 0 0)` | `#000000` | body text |
| `--color-primary` | `oklch(74.22% 0.209 6.35)` | `#ff6596` | primary action, focus intent |
| `--color-primary-content` | `oklch(14.84% 0.041 6.35)` | `#180408` | text on primary |
| `--color-secondary` | `oklch(83.33% 0.184 204.72)` | `#00e8ff` | hover and secondary chrome |
| `--color-secondary-content` | `oklch(16.67% 0.036 204.72)` | `#001316` | text on secondary |
| `--color-accent` | `oklch(71.86% 0.217 310.43)` | `#ce74ff` | sparing emphasis |
| `--color-accent-content` | `oklch(14.37% 0.043 310.43)` | `#0f0517` | text on accent |
| `--color-neutral` | `oklch(23.04% 0.065 269.31)` | `#111a3b` | footer, code, tooltips |
| `--color-neutral-content` | `oklch(94.51% 0.179 104.32)` | `#fff248` | text on neutral |
| `--color-info` | `oklch(72.06% 0.191 231.6)` | `#00b5ff` | informational |
| `--color-info-content` | `oklch(0% 0 0)` | `#000000` | text on info |
| `--color-success` | `oklch(64.8% 0.15 160)` | `#00a96e` | success, confirmation |
| `--color-success-content` | `oklch(0% 0 0)` | `#000000` | text on success |
| `--color-warning` | `oklch(84.71% 0.199 83.87)` | `#ffbe00` | warning, caution |
| `--color-warning-content` | `oklch(0% 0 0)` | `#000000` | text on warning |
| `--color-error` | `oklch(71.76% 0.221 22.18)` | `#ff5861` | error, destructive |
| `--color-error-content` | `oklch(0% 0 0)` | `#000000` | text on error |

## Shape and depth

| Token | Value | Applied to |
| --- | --- | --- |
| `--radius-selector` | `0rem` (0px) | chips, badges, switches, checkbox and radio containers |
| `--radius-field` | `0rem` (0px) | inputs, buttons, menu items, tooltips |
| `--radius-box` | `0rem` (0px) | cards, dialogs, drawers, hero blocks |
| `--border` | `1px` | stroke weight everywhere |
| `--depth` | `0` | flat: no shadows |
| `--noise` | `0` | no texture |

## Contrast

| Pair | Ratio | Level |
| --- | ---: | --- |
| `--color-base-content` on `--color-base-100` | 18.05:1 | AAA |
| `--color-base-content` on `--color-base-200` | 16.56:1 | AAA |
| `--color-base-content` on `--color-base-300` | 13.69:1 | AAA |
| `--color-primary-content` on `--color-primary` | 7.13:1 | AAA |
| `--color-secondary-content` on `--color-secondary` | 12.66:1 | AAA |
| `--color-accent-content` on `--color-accent` | 7.18:1 | AAA |
| `--color-neutral-content` on `--color-neutral` | 14.62:1 | AAA |
| `--color-info-content` on `--color-info` | 9.05:1 | AAA |
| `--color-success-content` on `--color-success` | 6.90:1 | AA |
| `--color-warning-content` on `--color-warning` | 12.62:1 | AAA |
| `--color-error-content` on `--color-error` | 6.82:1 | AA |

9 of 11 text pairs reach AAA (7:1). Every pair reaches at least AA (4.5:1).

## Behaviour beyond the tokens

None. This theme changes only the token block above; every component rule below it is the one all themes share, so the same markup renders in any theme and only these values differ.

## Design notes (from the stylesheet header)

Verbatim from the top of the stylesheet. File names quoted in it may predate the `for-patients` / `for-practitioners` naming.

```text
Lily theme: cyberpunk

Standalone Lily Design System theme — declares the theme tokens and inlines
the component CSS for all 492 Lily components, so this single file is the
only stylesheet required to render a Lily-styled page.

Credit for the theme source: DaisyUI (https://daisyui.com/)

Upstream tracked: DaisyUI v5-era theme palette, adapted to Lily tokens and hooks.
========================================================================= */

Theme tokens — the colour, radius, border, and depth variables consumed
by every Lily component rule below. The theme applies by default (`:root`)
and also when explicitly opted into via `<html data-theme="cyberpunk">`,
so multiple themes can coexist in one document and be switched at runtime
by updating the `data-theme` attribute. */
```

## Usage

```html
<link rel="stylesheet" href="/themes/cyberpunk.css" data-lily-theme-picker>
<html data-theme="cyberpunk">
```

`theme-picker` loads this stylesheet by swapping the managed `<link>`'s `href` and setting `data-theme="cyberpunk"` on the document root; `picker-bar` lists it by default. Installed from npm: `@lilydesignsystem/themes/cyberpunk.css`. The stylesheet is standalone: every Lily component rule is inlined, in `@layer lily` with zero-specificity `:where()` selectors, so application CSS always wins.

## Related

- [Themes index](../../index.md) — the package contract.
- [AGENTS/theme.md](../../../../AGENTS/theme.md) — token shape and the headless forbidden list.
- [spec/theme](../../../../spec/theme/index.md) — the theme topic.
- [spec/theme-picker](../../../../spec/theme-picker/index.md) — runtime switching.
