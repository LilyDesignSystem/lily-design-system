# Wireframe

Light theme on white with grey (`#d4d4d4`) primary, secondary and accent: a low-fidelity, sketch-like look for prototypes. Square selectors, flat.

## At a glance

| | |
| --- | --- |
| Slug / `data-theme` | `wireframe` |
| Stylesheet | [`themes/wireframe.css`](../../../../themes/wireframe.css) |
| Token source | [`themes/tokens/wireframe.json`](../../../../themes/tokens/wireframe.json) |
| Colour scheme | `light` |
| Group | General purpose (DaisyUI palette set) |
| Primary | `#d4d4d4` (neutral grey) |
| Page surface | `#ffffff` |
| Body text on page surface | `#161616`, 18.1:1 |
| Text pairs at AAA (7:1) | 7 of 11 |
| Text pairs below AA (4.5:1) | 0 of 11 |

## Upstream

- **Source:** DaisyUI (https://daisyui.com/)

## Palette

| Token | Value | sRGB | Role |
| --- | --- | --- | --- |
| `--color-base-100` | `oklch(100% 0 0)` | `#ffffff` | page surface |
| `--color-base-200` | `oklch(97% 0 0)` | `#f5f5f5` | panels, cards, table headers |
| `--color-base-300` | `oklch(94% 0 0)` | `#ebebeb` | dividers, hover rows, borders |
| `--color-base-content` | `oklch(20% 0 0)` | `#161616` | body text |
| `--color-primary` | `oklch(87% 0 0)` | `#d4d4d4` | primary action, focus intent |
| `--color-primary-content` | `oklch(26% 0 0)` | `#242424` | text on primary |
| `--color-secondary` | `oklch(87% 0 0)` | `#d4d4d4` | hover and secondary chrome |
| `--color-secondary-content` | `oklch(26% 0 0)` | `#242424` | text on secondary |
| `--color-accent` | `oklch(87% 0 0)` | `#d4d4d4` | sparing emphasis |
| `--color-accent-content` | `oklch(26% 0 0)` | `#242424` | text on accent |
| `--color-neutral` | `oklch(87% 0 0)` | `#d4d4d4` | footer, code, tooltips |
| `--color-neutral-content` | `oklch(26% 0 0)` | `#242424` | text on neutral |
| `--color-info` | `oklch(44% 0.11 240.79)` | `#005889` | informational |
| `--color-info-content` | `oklch(90% 0.058 230.902)` | `#b8e6fe` | text on info |
| `--color-success` | `oklch(43% 0.095 166.913)` | `#006044` | success, confirmation |
| `--color-success-content` | `oklch(90% 0.093 164.15)` | `#a3f2ce` | text on success |
| `--color-warning` | `oklch(47% 0.137 46.201)` | `#963b00` | warning, caution |
| `--color-warning-content` | `oklch(92% 0.12 95.746)` | `#fde484` | text on warning |
| `--color-error` | `oklch(44% 0.177 26.899)` | `#9d0410` | error, destructive |
| `--color-error-content` | `oklch(88% 0.062 18.334)` | `#fec8c8` | text on error |

## Shape and depth

| Token | Value | Applied to |
| --- | --- | --- |
| `--radius-selector` | `0rem` (0px) | chips, badges, switches, checkbox and radio containers |
| `--radius-field` | `0.25rem` (4px) | inputs, buttons, menu items, tooltips |
| `--radius-box` | `0.25rem` (4px) | cards, dialogs, drawers, hero blocks |
| `--border` | `1px` | stroke weight everywhere |
| `--depth` | `0` | flat: no shadows |
| `--noise` | `0` | no texture |

## Contrast

| Pair | Ratio | Level |
| --- | ---: | --- |
| `--color-base-content` on `--color-base-100` | 18.10:1 | AAA |
| `--color-base-content` on `--color-base-200` | 16.60:1 | AAA |
| `--color-base-content` on `--color-base-300` | 15.18:1 | AAA |
| `--color-primary-content` on `--color-primary` | 10.47:1 | AAA |
| `--color-secondary-content` on `--color-secondary` | 10.47:1 | AAA |
| `--color-accent-content` on `--color-accent` | 10.47:1 | AAA |
| `--color-neutral-content` on `--color-neutral` | 10.47:1 | AAA |
| `--color-info-content` on `--color-info` | 5.73:1 | AA |
| `--color-success-content` on `--color-success` | 5.86:1 | AA |
| `--color-warning-content` on `--color-warning` | 5.68:1 | AA |
| `--color-error-content` on `--color-error` | 5.82:1 | AA |

7 of 11 text pairs reach AAA (7:1). Every pair reaches at least AA (4.5:1).

## Behaviour beyond the tokens

None. This theme changes only the token block above; every component rule below it is the one all themes share, so the same markup renders in any theme and only these values differ.

## Usage

```html
<link rel="stylesheet" href="/themes/wireframe.css" data-lily-theme-picker>
<html data-theme="wireframe">
```

`theme-picker` loads this stylesheet by swapping the managed `<link>`'s `href` and setting `data-theme="wireframe"` on the document root; `picker-bar` lists it by default. Installed from npm: `@lilydesignsystem/themes/wireframe.css`. The stylesheet is standalone: every Lily component rule is inlined, in `@layer lily` with zero-specificity `:where()` selectors, so application CSS always wins.

## Related

- [Themes index](../../index.md) — the package contract.
- [AGENTS/theme.md](../../../../AGENTS/theme.md) — token shape and the headless forbidden list.
- [spec/theme](../../../../spec/theme/index.md) — the theme topic.
- [spec/theme-picker](../../../../spec/theme-picker/index.md) — runtime switching.
