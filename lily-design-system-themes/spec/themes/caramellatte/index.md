# Caramellatte

Light theme on a cream page (`#fff7ed`) with a black primary, deep-brown secondary and a rust accent. 2px borders, the noise flag on and a 2rem selector radius give it a warm, tactile feel.

## At a glance

| | |
| --- | --- |
| Slug / `data-theme` | `caramellatte` |
| Stylesheet | [`themes/caramellatte.css`](../../../../themes/caramellatte.css) |
| Token source | [`themes/tokens/caramellatte.json`](../../../../themes/tokens/caramellatte.json) |
| Colour scheme | `light` |
| Group | General purpose (DaisyUI palette set) |
| Primary | `#000000` (neutral grey) |
| Page surface | `#fff7ed` |
| Body text on page surface | `#7c2808`, 9.1:1 |
| Text pairs at AAA (7:1) | 5 of 11 |
| Text pairs below AA (4.5:1) | 1 of 11 |

## Upstream

- **Source:** DaisyUI (https://daisyui.com/)
- **Tracks:** DaisyUI v5-era theme palette, adapted to Lily tokens and hooks.

## Palette

| Token | Value | sRGB | Role |
| --- | --- | --- | --- |
| `--color-base-100` | `oklch(98% 0.016 73.684)` | `#fff7ed` | page surface |
| `--color-base-200` | `oklch(95% 0.038 75.164)` | `#feecd3` | panels, cards, table headers |
| `--color-base-300` | `oklch(90% 0.076 70.697)` | `#ffd6a7` | dividers, hover rows, borders |
| `--color-base-content` | `oklch(40% 0.123 38.172)` | `#7c2808` | body text |
| `--color-primary` | `oklch(0% 0 0)` | `#000000` | primary action, focus intent |
| `--color-primary-content` | `oklch(100% 0 0)` | `#ffffff` | text on primary |
| `--color-secondary` | `oklch(22.45% 0.075 37.85)` | `#370a00` | hover and secondary chrome |
| `--color-secondary-content` | `oklch(90% 0.076 70.697)` | `#ffd6a7` | text on secondary |
| `--color-accent` | `oklch(46.44% 0.111 37.85)` | `#8c3f27` | sparing emphasis |
| `--color-accent-content` | `oklch(90% 0.076 70.697)` | `#ffd6a7` | text on accent |
| `--color-neutral` | `oklch(55% 0.195 38.402)` | `#c93400` | footer, code, tooltips |
| `--color-neutral-content` | `oklch(98% 0.016 73.684)` | `#fff7ed` | text on neutral |
| `--color-info` | `oklch(42% 0.199 265.638)` | `#193ab7` | informational |
| `--color-info-content` | `oklch(90% 0.076 70.697)` | `#ffd6a7` | text on info |
| `--color-success` | `oklch(43% 0.095 166.913)` | `#006044` | success, confirmation |
| `--color-success-content` | `oklch(90% 0.076 70.697)` | `#ffd6a7` | text on success |
| `--color-warning` | `oklch(82% 0.189 84.429)` | `#fcb700` | warning, caution |
| `--color-warning-content` | `oklch(41% 0.112 45.904)` | `#793205` | text on warning |
| `--color-error` | `oklch(70% 0.191 22.216)` | `#ff6266` | error, destructive |
| `--color-error-content` | `oklch(39% 0.141 25.723)` | `#801518` | text on error |

## Shape and depth

| Token | Value | Applied to |
| --- | --- | --- |
| `--radius-selector` | `2rem` (32px) | chips, badges, switches, checkbox and radio containers |
| `--radius-field` | `0.5rem` (8px) | inputs, buttons, menu items, tooltips |
| `--radius-box` | `1rem` (16px) | cards, dialogs, drawers, hero blocks |
| `--border` | `2px` | stroke weight everywhere |
| `--depth` | `1` | shadows on |
| `--noise` | `1` | texture layer |

## Contrast

| Pair | Ratio | Level |
| --- | ---: | --- |
| `--color-base-content` on `--color-base-100` | 9.14:1 | AAA |
| `--color-base-content` on `--color-base-200` | 8.39:1 | AAA |
| `--color-base-content` on `--color-base-300` | 7.13:1 | AAA |
| `--color-primary-content` on `--color-primary` | 21.00:1 | AAA |
| `--color-secondary-content` on `--color-secondary` | 12.79:1 | AAA |
| `--color-accent-content` on `--color-accent` | 5.40:1 | AA |
| `--color-neutral-content` on `--color-neutral` | 4.98:1 | AA |
| `--color-info-content` on `--color-info` | 6.62:1 | AA |
| `--color-success-content` on `--color-success` | 5.60:1 | AA |
| `--color-warning-content` on `--color-warning` | 5.24:1 | AA |
| `--color-error-content` on `--color-error` | 3.53:1 | AA large |

5 of 11 text pairs reach AAA (7:1). Below AA (4.5:1): `--color-error-content` on `--color-error` 3.53:1. These are the theme author's colours; Lily never rewrites them, and `bin/check-theme --contrast` reports the same pairs.

## Behaviour beyond the tokens

None. This theme changes only the token block above; every component rule below it is the one all themes share, so the same markup renders in any theme and only these values differ.

## Design notes (from the stylesheet header)

Verbatim from the top of the stylesheet. File names quoted in it may predate the `for-patients` / `for-practitioners` naming.

```text
Lily theme: caramellatte

Standalone Lily Design System theme — declares the theme tokens and inlines
the component CSS for all 492 Lily components, so this single file is the
only stylesheet required to render a Lily-styled page.

Credit for the theme source: DaisyUI (https://daisyui.com/)

Upstream tracked: DaisyUI v5-era theme palette, adapted to Lily tokens and hooks.
========================================================================= */

Theme tokens — the colour, radius, border, and depth variables consumed
by every Lily component rule below. The theme applies by default (`:root`)
and also when explicitly opted into via `<html data-theme="caramellatte">`,
so multiple themes can coexist in one document and be switched at runtime
by updating the `data-theme` attribute. */
```

## Usage

```html
<link rel="stylesheet" href="/themes/caramellatte.css" data-lily-theme-picker>
<html data-theme="caramellatte">
```

`theme-picker` loads this stylesheet by swapping the managed `<link>`'s `href` and setting `data-theme="caramellatte"` on the document root; `picker-bar` lists it by default. Installed from npm: `@lilydesignsystem/themes/caramellatte.css`. The stylesheet is standalone: every Lily component rule is inlined, in `@layer lily` with zero-specificity `:where()` selectors, so application CSS always wins.

## Related

- [Themes index](../../index.md) — the package contract.
- [AGENTS/theme.md](../../../../AGENTS/theme.md) — token shape and the headless forbidden list.
- [spec/theme](../../../../spec/theme/index.md) — the theme topic.
- [spec/theme-picker](../../../../spec/theme-picker/index.md) — runtime switching.
