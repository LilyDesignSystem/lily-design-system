# Nord

Light cool-grey page (`#eceff4`) with the Nord frost blues as primary (`#5e81ac`), secondary (`#81a1c1`) and accent (`#88c0d0`), after the Nord palette. Flat, 1rem selector radius.

## At a glance

| | |
| --- | --- |
| Slug / `data-theme` | `nord` |
| Stylesheet | [`themes/nord.css`](../../../../themes/nord.css) |
| Token source | [`themes/tokens/nord.json`](../../../../themes/tokens/nord.json) |
| Colour scheme | `light` |
| Group | General purpose (DaisyUI palette set) |
| Primary | `#5e81ac` (blue) |
| Page surface | `#eceff4` |
| Body text on page surface | `#2e3440`, 10.8:1 |
| Text pairs at AAA (7:1) | 8 of 11 |
| Text pairs below AA (4.5:1) | 0 of 11 |

## Upstream

- **Source:** DaisyUI (https://daisyui.com/)
- **Tracks:** DaisyUI v5-era theme palette, adapted to Lily tokens and hooks.

## Palette

| Token | Value | sRGB | Role |
| --- | --- | --- | --- |
| `--color-base-100` | `oklch(95.13% 0.007 260.731)` | `#eceff4` | page surface |
| `--color-base-200` | `oklch(93.3% 0.01 261.788)` | `#e5e9f0` | panels, cards, table headers |
| `--color-base-300` | `oklch(89.92% 0.016 262.749)` | `#d8dee9` | dividers, hover rows, borders |
| `--color-base-content` | `oklch(32.44% 0.022 264.182)` | `#2e3440` | body text |
| `--color-primary` | `oklch(59.44% 0.077 254.027)` | `#5e81ac` | primary action, focus intent |
| `--color-primary-content` | `oklch(11.89% 0.015 254.027)` | `#03060b` | text on primary |
| `--color-secondary` | `oklch(69.65% 0.059 248.687)` | `#81a1c1` | hover and secondary chrome |
| `--color-secondary-content` | `oklch(13.93% 0.011 248.687)` | `#06090d` | text on secondary |
| `--color-accent` | `oklch(77.46% 0.062 217.469)` | `#88c0d0` | sparing emphasis |
| `--color-accent-content` | `oklch(15.49% 0.012 217.469)` | `#070d10` | text on accent |
| `--color-neutral` | `oklch(45.23% 0.035 264.131)` | `#4c566a` | footer, code, tooltips |
| `--color-neutral-content` | `oklch(89.92% 0.016 262.749)` | `#d8dee9` | text on neutral |
| `--color-info` | `oklch(69.21% 0.062 332.664)` | `#b48ead` | informational |
| `--color-info-content` | `oklch(13.84% 0.012 332.664)` | `#0c070b` | text on info |
| `--color-success` | `oklch(76.83% 0.074 131.063)` | `#a3be8d` | success, confirmation |
| `--color-success-content` | `oklch(15.37% 0.014 131.063)` | `#0a0d07` | text on success |
| `--color-warning` | `oklch(85.49% 0.089 84.093)` | `#ebcb8b` | warning, caution |
| `--color-warning-content` | `oklch(17.1% 0.017 84.093)` | `#130f07` | text on warning |
| `--color-error` | `oklch(60.61% 0.12 15.341)` | `#bf616a` | error, destructive |
| `--color-error-content` | `oklch(12.12% 0.024 15.341)` | `#0d0304` | text on error |

## Shape and depth

| Token | Value | Applied to |
| --- | --- | --- |
| `--radius-selector` | `1rem` (16px) | chips, badges, switches, checkbox and radio containers |
| `--radius-field` | `0.25rem` (4px) | inputs, buttons, menu items, tooltips |
| `--radius-box` | `0.5rem` (8px) | cards, dialogs, drawers, hero blocks |
| `--border` | `1px` | stroke weight everywhere |
| `--depth` | `0` | flat: no shadows |
| `--noise` | `0` | no texture |

## Contrast

| Pair | Ratio | Level |
| --- | ---: | --- |
| `--color-base-content` on `--color-base-100` | 10.84:1 | AAA |
| `--color-base-content` on `--color-base-200` | 10.26:1 | AAA |
| `--color-base-content` on `--color-base-300` | 9.25:1 | AAA |
| `--color-primary-content` on `--color-primary` | 5.04:1 | AA |
| `--color-secondary-content` on `--color-secondary` | 7.41:1 | AAA |
| `--color-accent-content` on `--color-accent` | 9.77:1 | AAA |
| `--color-neutral-content` on `--color-neutral` | 5.46:1 | AA |
| `--color-info-content` on `--color-info` | 7.05:1 | AAA |
| `--color-success-content` on `--color-success` | 9.60:1 | AAA |
| `--color-warning-content` on `--color-warning` | 12.24:1 | AAA |
| `--color-error-content` on `--color-error` | 4.97:1 | AA |

8 of 11 text pairs reach AAA (7:1). Every pair reaches at least AA (4.5:1).

## Behaviour beyond the tokens

None. This theme changes only the token block above; every component rule below it is the one all themes share, so the same markup renders in any theme and only these values differ.

## Design notes (from the stylesheet header)

Verbatim from the top of the stylesheet. File names quoted in it may predate the `for-patients` / `for-practitioners` naming.

```text
Lily theme: nord

Standalone Lily Design System theme — declares the theme tokens and inlines
the component CSS for all 492 Lily components, so this single file is the
only stylesheet required to render a Lily-styled page.

Credit for the theme source: DaisyUI (https://daisyui.com/)

Upstream tracked: DaisyUI v5-era theme palette, adapted to Lily tokens and hooks.
========================================================================= */

Theme tokens — the colour, radius, border, and depth variables consumed
by every Lily component rule below. The theme applies by default (`:root`)
and also when explicitly opted into via `<html data-theme="nord">`,
so multiple themes can coexist in one document and be switched at runtime
by updating the `data-theme` attribute. */
```

## Usage

```html
<link rel="stylesheet" href="/themes/nord.css" data-lily-theme-picker>
<html data-theme="nord">
```

`theme-picker` loads this stylesheet by swapping the managed `<link>`'s `href` and setting `data-theme="nord"` on the document root; `picker-bar` lists it by default. Installed from npm: `@lilydesignsystem/themes/nord.css`. The stylesheet is standalone: every Lily component rule is inlined, in `@layer lily` with zero-specificity `:where()` selectors, so application CSS always wins.

## Related

- [Themes index](../../index.md) — the package contract.
- [AGENTS/theme.md](../../../../AGENTS/theme.md) — token shape and the headless forbidden list.
- [spec/theme](../../../../spec/theme/index.md) — the theme topic.
- [spec/theme-picker](../../../../spec/theme-picker/index.md) — runtime switching.
