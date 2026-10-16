# Valentine

Light theme on a pale-pink page (`#fcf2f8`) with a rose primary (`#f43098`), purple secondary and sky-blue accent. Flat, 2rem field radius.

## At a glance

| | |
| --- | --- |
| Slug / `data-theme` | `valentine` |
| Stylesheet | [`themes/valentine.css`](../../../../themes/valentine.css) |
| Token source | [`themes/tokens/valentine.json`](../../../../themes/tokens/valentine.json) |
| Colour scheme | `light` |
| Group | General purpose (DaisyUI palette set) |
| Primary | `#f43098` (red) |
| Page surface | `#fcf2f8` |
| Body text on page surface | `#c5005a`, 5.5:1 |
| Text pairs at AAA (7:1) | 1 of 11 |
| Text pairs below AA (4.5:1) | 4 of 11 |

## Upstream

- **Source:** DaisyUI (https://daisyui.com/)

## Palette

| Token | Value | sRGB | Role |
| --- | --- | --- | --- |
| `--color-base-100` | `oklch(97% 0.014 343.198)` | `#fcf2f8` | page surface |
| `--color-base-200` | `oklch(94% 0.028 342.258)` | `#f9e4f0` | panels, cards, table headers |
| `--color-base-300` | `oklch(89% 0.061 343.231)` | `#f9cbe5` | dividers, hover rows, borders |
| `--color-base-content` | `oklch(52% 0.223 3.958)` | `#c5005a` | body text |
| `--color-primary` | `oklch(65% 0.241 354.308)` | `#f43098` | primary action, focus intent |
| `--color-primary-content` | `oklch(100% 0 0)` | `#ffffff` | text on primary |
| `--color-secondary` | `oklch(62% 0.265 303.9)` | `#ab44ff` | hover and secondary chrome |
| `--color-secondary-content` | `oklch(97% 0.014 308.299)` | `#f8f3fd` | text on secondary |
| `--color-accent` | `oklch(82% 0.111 230.318)` | `#71d1fe` | sparing emphasis |
| `--color-accent-content` | `oklch(39% 0.09 240.876)` | `#014a70` | text on accent |
| `--color-neutral` | `oklch(40% 0.153 2.432)` | `#830c41` | footer, code, tooltips |
| `--color-neutral-content` | `oklch(89% 0.061 343.231)` | `#f9cbe5` | text on neutral |
| `--color-info` | `oklch(86% 0.127 207.078)` | `#51e8fb` | informational |
| `--color-info-content` | `oklch(44% 0.11 240.79)` | `#005889` | text on info |
| `--color-success` | `oklch(84% 0.143 164.978)` | `#5ce8b3` | success, confirmation |
| `--color-success-content` | `oklch(43% 0.095 166.913)` | `#006044` | text on success |
| `--color-warning` | `oklch(75% 0.183 55.934)` | `#ff8904` | warning, caution |
| `--color-warning-content` | `oklch(26% 0.079 36.259)` | `#421104` | text on warning |
| `--color-error` | `oklch(63% 0.237 25.331)` | `#f82834` | error, destructive |
| `--color-error-content` | `oklch(97% 0.013 17.38)` | `#fef2f2` | text on error |

## Shape and depth

| Token | Value | Applied to |
| --- | --- | --- |
| `--radius-selector` | `1rem` (16px) | chips, badges, switches, checkbox and radio containers |
| `--radius-field` | `2rem` (32px) | inputs, buttons, menu items, tooltips |
| `--radius-box` | `1rem` (16px) | cards, dialogs, drawers, hero blocks |
| `--border` | `1px` | stroke weight everywhere |
| `--depth` | `0` | flat: no shadows |
| `--noise` | `0` | no texture |

## Contrast

| Pair | Ratio | Level |
| --- | ---: | --- |
| `--color-base-content` on `--color-base-100` | 5.45:1 | AA |
| `--color-base-content` on `--color-base-200` | 4.94:1 | AA |
| `--color-base-content` on `--color-base-300` | 4.17:1 | AA large |
| `--color-primary-content` on `--color-primary` | 3.67:1 | AA large |
| `--color-secondary-content` on `--color-secondary` | 3.84:1 | AA large |
| `--color-accent-content` on `--color-accent` | 5.53:1 | AA |
| `--color-neutral-content` on `--color-neutral` | 7.02:1 | AAA |
| `--color-info-content` on `--color-info` | 5.18:1 | AA |
| `--color-success-content` on `--color-success` | 4.95:1 | AA |
| `--color-warning-content` on `--color-warning` | 6.72:1 | AA |
| `--color-error-content` on `--color-error` | 3.59:1 | AA large |

1 of 11 text pairs reach AAA (7:1). Below AA (4.5:1): `--color-base-content` on `--color-base-300` 4.17:1; `--color-primary-content` on `--color-primary` 3.67:1; `--color-secondary-content` on `--color-secondary` 3.84:1; `--color-error-content` on `--color-error` 3.59:1. These are the theme author's colours; Lily never rewrites them, and `bin/check-theme --contrast` reports the same pairs.

## Behaviour beyond the tokens

None. This theme changes only the token block above; every component rule below it is the one all themes share, so the same markup renders in any theme and only these values differ.

## Usage

```html
<link rel="stylesheet" href="/themes/valentine.css" data-lily-theme-picker>
<html data-theme="valentine">
```

`theme-picker` loads this stylesheet by swapping the managed `<link>`'s `href` and setting `data-theme="valentine"` on the document root; `picker-bar` lists it by default. Installed from npm: `@lilydesignsystem/themes/valentine.css`. The stylesheet is standalone: every Lily component rule is inlined, in `@layer lily` with zero-specificity `:where()` selectors, so application CSS always wins.

## Related

- [Themes index](../../index.md) — the package contract.
- [AGENTS/theme.md](../../../../AGENTS/theme.md) — token shape and the headless forbidden list.
- [spec/theme](../../../../spec/theme/index.md) — the theme topic.
- [spec/theme-picker](../../../../spec/theme-picker/index.md) — runtime switching.
