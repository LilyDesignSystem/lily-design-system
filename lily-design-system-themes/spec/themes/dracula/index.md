# Dracula

Dark charcoal-purple page (`#282a36`) with a pink primary (`#ff79c6`), purple secondary (`#bd93f9`) and orange accent, after the Dracula colour scheme. Flat, 1rem radii.

## At a glance

| | |
| --- | --- |
| Slug / `data-theme` | `dracula` |
| Stylesheet | [`themes/dracula.css`](../../../../themes/dracula.css) |
| Token source | [`themes/tokens/dracula.json`](../../../../themes/tokens/dracula.json) |
| Colour scheme | `dark` |
| Group | General purpose (DaisyUI palette set) |
| Primary | `#ff79c6` (pink) |
| Page surface | `#282a36` |
| Body text on page surface | `#f8f8f3`, 13.4:1 |
| Text pairs at AAA (7:1) | 9 of 11 |
| Text pairs below AA (4.5:1) | 0 of 11 |

## Upstream

- **Source:** DaisyUI (https://daisyui.com/)
- **Tracks:** DaisyUI v5-era theme palette, adapted to Lily tokens and hooks.

## Palette

| Token | Value | sRGB | Role |
| --- | --- | --- | --- |
| `--color-base-100` | `oklch(28.82% 0.022 277.508)` | `#282a36` | page surface |
| `--color-base-200` | `oklch(26.81% 0.02 277.508)` | `#232530` | panels, cards, table headers |
| `--color-base-300` | `oklch(24.79% 0.019 277.508)` | `#1f202a` | dividers, hover rows, borders |
| `--color-base-content` | `oklch(97.75% 0.007 106.545)` | `#f8f8f3` | body text |
| `--color-primary` | `oklch(75.46% 0.183 346.812)` | `#ff79c6` | primary action, focus intent |
| `--color-primary-content` | `oklch(15.09% 0.036 346.812)` | `#16050e` | text on primary |
| `--color-secondary` | `oklch(74.2% 0.148 301.883)` | `#bd93f9` | hover and secondary chrome |
| `--color-secondary-content` | `oklch(14.84% 0.029 301.883)` | `#0d0815` | text on secondary |
| `--color-accent` | `oklch(83.39% 0.124 66.558)` | `#ffb86c` | sparing emphasis |
| `--color-accent-content` | `oklch(16.68% 0.024 66.558)` | `#160d04` | text on accent |
| `--color-neutral` | `oklch(39.45% 0.032 275.524)` | `#414558` | footer, code, tooltips |
| `--color-neutral-content` | `oklch(87.89% 0.006 275.524)` | `#d6d7db` | text on neutral |
| `--color-info` | `oklch(88.26% 0.093 212.846)` | `#8be9fd` | informational |
| `--color-info-content` | `oklch(17.65% 0.018 212.846)` | `#071316` | text on info |
| `--color-success` | `oklch(87.1% 0.219 148.024)` | `#51fa7b` | success, confirmation |
| `--color-success-content` | `oklch(17.42% 0.043 148.024)` | `#021505` | text on success |
| `--color-warning` | `oklch(95.53% 0.134 112.757)` | `#f1fa8c` | warning, caution |
| `--color-warning-content` | `oklch(19.11% 0.026 112.757)` | `#141507` | text on warning |
| `--color-error` | `oklch(68.22% 0.206 24.43)` | `#ff5555` | error, destructive |
| `--color-error-content` | `oklch(13.64% 0.041 24.43)` | `#160202` | text on error |

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
| `--color-base-content` on `--color-base-100` | 13.37:1 | AAA |
| `--color-base-content` on `--color-base-200` | 14.30:1 | AAA |
| `--color-base-content` on `--color-base-300` | 15.18:1 | AAA |
| `--color-primary-content` on `--color-primary` | 8.29:1 | AAA |
| `--color-secondary-content` on `--color-secondary` | 8.19:1 | AAA |
| `--color-accent-content` on `--color-accent` | 11.27:1 | AAA |
| `--color-neutral-content` on `--color-neutral` | 6.59:1 | AA |
| `--color-info-content` on `--color-info` | 13.62:1 | AAA |
| `--color-success-content` on `--color-success` | 13.77:1 | AAA |
| `--color-warning-content` on `--color-warning` | 16.48:1 | AAA |
| `--color-error-content` on `--color-error` | 6.40:1 | AA |

9 of 11 text pairs reach AAA (7:1). Every pair reaches at least AA (4.5:1).

## Behaviour beyond the tokens

None. This theme changes only the token block above; every component rule below it is the one all themes share, so the same markup renders in any theme and only these values differ.

## Design notes (from the stylesheet header)

Verbatim from the top of the stylesheet. File names quoted in it may predate the `for-patients` / `for-practitioners` naming.

```text
Lily theme: dracula

Standalone Lily Design System theme — declares the theme tokens and inlines
the component CSS for all 492 Lily components, so this single file is the
only stylesheet required to render a Lily-styled page.

Credit for the theme source: DaisyUI (https://daisyui.com/)

Upstream tracked: DaisyUI v5-era theme palette, adapted to Lily tokens and hooks.
========================================================================= */

Theme tokens — the colour, radius, border, and depth variables consumed
by every Lily component rule below. The theme applies by default (`:root`)
and also when explicitly opted into via `<html data-theme="dracula">`,
so multiple themes can coexist in one document and be switched at runtime
by updating the `data-theme` attribute. */
```

## Usage

```html
<link rel="stylesheet" href="/themes/dracula.css" data-lily-theme-picker>
<html data-theme="dracula">
```

`theme-picker` loads this stylesheet by swapping the managed `<link>`'s `href` and setting `data-theme="dracula"` on the document root; `picker-bar` lists it by default. Installed from npm: `@lilydesignsystem/themes/dracula.css`. The stylesheet is standalone: every Lily component rule is inlined, in `@layer lily` with zero-specificity `:where()` selectors, so application CSS always wins.

## Related

- [Themes index](../../index.md) — the package contract.
- [AGENTS/theme.md](../../../../AGENTS/theme.md) — token shape and the headless forbidden list.
- [spec/theme](../../../../spec/theme/index.md) — the theme topic.
- [spec/theme-picker](../../../../spec/theme-picker/index.md) — runtime switching.
