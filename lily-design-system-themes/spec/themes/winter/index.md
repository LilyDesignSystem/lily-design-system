# Winter

Light theme on white with a blue primary (`#0069ff`), indigo secondary and orchid accent. Flat, 1rem radii.

## At a glance

| | |
| --- | --- |
| Slug / `data-theme` | `winter` |
| Stylesheet | [`themes/winter.css`](../../../../themes/winter.css) |
| Token source | [`themes/tokens/winter.json`](../../../../themes/tokens/winter.json) |
| Colour scheme | `light` |
| Group | General purpose (DaisyUI palette set) |
| Primary | `#0069ff` (blue) |
| Page surface | `#ffffff` |
| Body text on page surface | `#394e6a`, 8.5:1 |
| Text pairs at AAA (7:1) | 7 of 11 |
| Text pairs below AA (4.5:1) | 1 of 11 |

## Upstream

- **Source:** DaisyUI (https://daisyui.com/)

## Palette

| Token | Value | sRGB | Role |
| --- | --- | --- | --- |
| `--color-base-100` | `oklch(100% 0 0)` | `#ffffff` | page surface |
| `--color-base-200` | `oklch(97.47% 0.011 259.822)` | `#f2f7fe` | panels, cards, table headers |
| `--color-base-300` | `oklch(93.27% 0.016 262.751)` | `#e3e9f4` | dividers, hover rows, borders |
| `--color-base-content` | `oklch(41.89% 0.053 255.824)` | `#394e6a` | body text |
| `--color-primary` | `oklch(56.86% 0.255 257.57)` | `#0069ff` | primary action, focus intent |
| `--color-primary-content` | `oklch(91.37% 0.051 257.57)` | `#cee4ff` | text on primary |
| `--color-secondary` | `oklch(42.55% 0.161 282.339)` | `#463aa2` | hover and secondary chrome |
| `--color-secondary-content` | `oklch(88.51% 0.032 282.339)` | `#d5d7ee` | text on secondary |
| `--color-accent` | `oklch(59.94% 0.191 335.171)` | `#c148ac` | sparing emphasis |
| `--color-accent-content` | `oklch(11.99% 0.038 335.171)` | `#0e020b` | text on accent |
| `--color-neutral` | `oklch(19.62% 0.063 257.651)` | `#021431` | footer, code, tooltips |
| `--color-neutral-content` | `oklch(83.92% 0.012 257.651)` | `#c5cbd2` | text on neutral |
| `--color-info` | `oklch(88.13% 0.085 214.515)` | `#94e7fb` | informational |
| `--color-info-content` | `oklch(17.62% 0.017 214.515)` | `#081315` | text on info |
| `--color-success` | `oklch(80.49% 0.077 197.823)` | `#81cfd1` | success, confirmation |
| `--color-success-content` | `oklch(16.1% 0.015 197.823)` | `#060f10` | text on success |
| `--color-warning` | `oklch(89.17% 0.045 71.47)` | `#efd7bc` | warning, caution |
| `--color-warning-content` | `oklch(17.83% 0.009 71.47)` | `#14110d` | text on warning |
| `--color-error` | `oklch(73.09% 0.11 20.076)` | `#e58b8b` | error, destructive |
| `--color-error-content` | `oklch(14.62% 0.022 20.076)` | `#120707` | text on error |

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
| `--color-base-content` on `--color-base-100` | 8.50:1 | AAA |
| `--color-base-content` on `--color-base-200` | 7.89:1 | AAA |
| `--color-base-content` on `--color-base-300` | 6.97:1 | AA |
| `--color-primary-content` on `--color-primary` | 3.62:1 | AA large |
| `--color-secondary-content` on `--color-secondary` | 6.19:1 | AA |
| `--color-accent-content` on `--color-accent` | 4.64:1 | AA |
| `--color-neutral-content` on `--color-neutral` | 11.20:1 | AAA |
| `--color-info-content` on `--color-info` | 13.54:1 | AAA |
| `--color-success-content` on `--color-success` | 10.87:1 | AAA |
| `--color-warning-content` on `--color-warning` | 13.55:1 | AAA |
| `--color-error-content` on `--color-error` | 7.93:1 | AAA |

7 of 11 text pairs reach AAA (7:1). Below AA (4.5:1): `--color-primary-content` on `--color-primary` 3.62:1. These are the theme author's colours; Lily never rewrites them, and `bin/check-theme --contrast` reports the same pairs.

## Behaviour beyond the tokens

None. This theme changes only the token block above; every component rule below it is the one all themes share, so the same markup renders in any theme and only these values differ.

## Usage

```html
<link rel="stylesheet" href="/themes/winter.css" data-lily-theme-picker>
<html data-theme="winter">
```

`theme-picker` loads this stylesheet by swapping the managed `<link>`'s `href` and setting `data-theme="winter"` on the document root; `picker-bar` lists it by default. Installed from npm: `@lilydesignsystem/themes/winter.css`. The stylesheet is standalone: every Lily component rule is inlined, in `@layer lily` with zero-specificity `:where()` selectors, so application CSS always wins.

## Related

- [Themes index](../../index.md) — the package contract.
- [AGENTS/theme.md](../../../../AGENTS/theme.md) — token shape and the headless forbidden list.
- [spec/theme](../../../../spec/theme/index.md) — the theme topic.
- [spec/theme-picker](../../../../spec/theme-picker/index.md) — runtime switching.
