# Forest

Dark warm near-black page (`#1b1717`) with a green primary (`#1fb854`) and two teal companions. 2rem field radius, flat.

## At a glance

| | |
| --- | --- |
| Slug / `data-theme` | `forest` |
| Stylesheet | [`themes/forest.css`](../../../../themes/forest.css) |
| Token source | [`themes/tokens/forest.json`](../../../../themes/tokens/forest.json) |
| Colour scheme | `dark` |
| Group | General purpose (DaisyUI palette set) |
| Primary | `#1fb854` (green) |
| Page surface | `#1b1717` |
| Body text on page surface | `#cac9c9`, 10.8:1 |
| Text pairs at AAA (7:1) | 9 of 11 |
| Text pairs below AA (4.5:1) | 0 of 11 |

## Upstream

- **Source:** DaisyUI (https://daisyui.com/)
- **Tracks:** DaisyUI v5-era theme palette, adapted to Lily tokens and hooks.

## Palette

| Token | Value | sRGB | Role |
| --- | --- | --- | --- |
| `--color-base-100` | `oklch(20.84% 0.008 17.911)` | `#1b1717` | page surface |
| `--color-base-200` | `oklch(18.52% 0.007 17.911)` | `#161212` | panels, cards, table headers |
| `--color-base-300` | `oklch(16.2% 0.007 17.911)` | `#110d0d` | dividers, hover rows, borders |
| `--color-base-content` | `oklch(83.77% 0.001 17.911)` | `#cac9c9` | body text |
| `--color-primary` | `oklch(68.63% 0.185 148.958)` | `#1fb854` | primary action, focus intent |
| `--color-primary-content` | `oklch(0% 0 0)` | `#000000` | text on primary |
| `--color-secondary` | `oklch(69.78% 0.135 168.327)` | `#1eb88e` | hover and secondary chrome |
| `--color-secondary-content` | `oklch(13.96% 0.027 168.327)` | `#000c07` | text on secondary |
| `--color-accent` | `oklch(70.63% 0.119 185.713)` | `#1fb8ab` | sparing emphasis |
| `--color-accent-content` | `oklch(14.12% 0.023 185.713)` | `#010c0b` | text on accent |
| `--color-neutral` | `oklch(30.7% 0.039 171.364)` | `#19362d` | footer, code, tooltips |
| `--color-neutral-content` | `oklch(86.14% 0.007 171.364)` | `#cdd3d1` | text on neutral |
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
| `--radius-selector` | `1rem` (16px) | chips, badges, switches, checkbox and radio containers |
| `--radius-field` | `2rem` (32px) | inputs, buttons, menu items, tooltips |
| `--radius-box` | `1rem` (16px) | cards, dialogs, drawers, hero blocks |
| `--border` | `1px` | stroke weight everywhere |
| `--depth` | `0` | flat: no shadows |
| `--noise` | `0` | no texture |

## Contrast

| Pair | Ratio | Level |
| --- | ---: | --- |
| `--color-base-content` on `--color-base-100` | 10.76:1 | AAA |
| `--color-base-content` on `--color-base-200` | 11.25:1 | AAA |
| `--color-base-content` on `--color-base-300` | 11.69:1 | AAA |
| `--color-primary-content` on `--color-primary` | 8.04:1 | AAA |
| `--color-secondary-content` on `--color-secondary` | 7.86:1 | AAA |
| `--color-accent-content` on `--color-accent` | 8.03:1 | AAA |
| `--color-neutral-content` on `--color-neutral` | 8.61:1 | AAA |
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
Lily theme: forest

Standalone Lily Design System theme — declares the theme tokens and inlines
the component CSS for all 492 Lily components, so this single file is the
only stylesheet required to render a Lily-styled page.

Credit for the theme source: DaisyUI (https://daisyui.com/)

Upstream tracked: DaisyUI v5-era theme palette, adapted to Lily tokens and hooks.
========================================================================= */

Theme tokens — the colour, radius, border, and depth variables consumed
by every Lily component rule below. The theme applies by default (`:root`)
and also when explicitly opted into via `<html data-theme="forest">`,
so multiple themes can coexist in one document and be switched at runtime
by updating the `data-theme` attribute. */
```

## Usage

```html
<link rel="stylesheet" href="/themes/forest.css" data-lily-theme-picker>
<html data-theme="forest">
```

`theme-picker` loads this stylesheet by swapping the managed `<link>`'s `href` and setting `data-theme="forest"` on the document root; `picker-bar` lists it by default. Installed from npm: `@lilydesignsystem/themes/forest.css`. The stylesheet is standalone: every Lily component rule is inlined, in `@layer lily` with zero-specificity `:where()` selectors, so application CSS always wins.

## Related

- [Themes index](../../index.md) — the package contract.
- [AGENTS/theme.md](../../../../AGENTS/theme.md) — token shape and the headless forbidden list.
- [spec/theme](../../../../spec/theme/index.md) — the theme topic.
- [spec/theme-picker](../../../../spec/theme-picker/index.md) — runtime switching.
