# Night

Dark navy page (`#0f172a`) with a sky-blue primary (`#3abdf7`), indigo secondary and pink accent. Flat, 1rem radii.

## At a glance

| | |
| --- | --- |
| Slug / `data-theme` | `night` |
| Stylesheet | [`themes/night.css`](../../../../themes/night.css) |
| Token source | [`themes/tokens/night.json`](../../../../themes/tokens/night.json) |
| Colour scheme | `dark` |
| Group | General purpose (DaisyUI palette set) |
| Primary | `#3abdf7` (blue) |
| Page surface | `#0f172a` |
| Body text on page surface | `#c9cbd0`, 11.0:1 |
| Text pairs at AAA (7:1) | 10 of 11 |
| Text pairs below AA (4.5:1) | 0 of 11 |

## Upstream

- **Source:** DaisyUI (https://daisyui.com/)
- **Tracks:** DaisyUI v5-era theme palette, adapted to Lily tokens and hooks.

## Palette

| Token | Value | sRGB | Role |
| --- | --- | --- | --- |
| `--color-base-100` | `oklch(20.77% 0.039 265.754)` | `#0f172a` | page surface |
| `--color-base-200` | `oklch(19.31% 0.037 265.754)` | `#0c1425` | panels, cards, table headers |
| `--color-base-300` | `oklch(17.86% 0.034 265.754)` | `#0a1120` | dividers, hover rows, borders |
| `--color-base-content` | `oklch(84.15% 0.007 265.754)` | `#c9cbd0` | body text |
| `--color-primary` | `oklch(75.35% 0.138 232.661)` | `#3abdf7` | primary action, focus intent |
| `--color-primary-content` | `oklch(15.07% 0.027 232.661)` | `#010d15` | text on primary |
| `--color-secondary` | `oklch(68.01% 0.158 276.934)` | `#818cf8` | hover and secondary chrome |
| `--color-secondary-content` | `oklch(13.6% 0.031 276.934)` | `#060715` | text on secondary |
| `--color-accent` | `oklch(72.36% 0.176 350.048)` | `#f471b5` | sparing emphasis |
| `--color-accent-content` | `oklch(14.47% 0.035 350.048)` | `#14040c` | text on accent |
| `--color-neutral` | `oklch(27.95% 0.036 260.03)` | `#1e293b` | footer, code, tooltips |
| `--color-neutral-content` | `oklch(85.59% 0.007 260.03)` | `#cdd0d4` | text on neutral |
| `--color-info` | `oklch(68.45% 0.148 237.251)` | `#0ca5e9` | informational |
| `--color-info-content` | `oklch(0% 0 0)` | `#000000` | text on info |
| `--color-success` | `oklch(78.45% 0.132 181.911)` | `#2fd4bf` | success, confirmation |
| `--color-success-content` | `oklch(15.69% 0.026 181.911)` | `#01100d` | text on success |
| `--color-warning` | `oklch(83.24% 0.139 82.95)` | `#f4bf51` | warning, caution |
| `--color-warning-content` | `oklch(16.65% 0.027 82.95)` | `#140d02` | text on warning |
| `--color-error` | `oklch(71.78% 0.17 13.118)` | `#fb7085` | error, destructive |
| `--color-error-content` | `oklch(14.36% 0.034 13.118)` | `#150406` | text on error |

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
| `--color-base-content` on `--color-base-100` | 11.00:1 | AAA |
| `--color-base-content` on `--color-base-200` | 11.32:1 | AAA |
| `--color-base-content` on `--color-base-300` | 11.61:1 | AAA |
| `--color-primary-content` on `--color-primary` | 9.16:1 | AAA |
| `--color-secondary-content` on `--color-secondary` | 6.71:1 | AA |
| `--color-accent-content` on `--color-accent` | 7.48:1 | AAA |
| `--color-neutral-content` on `--color-neutral` | 9.45:1 | AAA |
| `--color-info-content` on `--color-info` | 7.57:1 | AAA |
| `--color-success-content` on `--color-success` | 10.44:1 | AAA |
| `--color-warning-content` on `--color-warning` | 11.41:1 | AAA |
| `--color-error-content` on `--color-error` | 7.38:1 | AAA |

10 of 11 text pairs reach AAA (7:1). Every pair reaches at least AA (4.5:1).

## Behaviour beyond the tokens

None. This theme changes only the token block above; every component rule below it is the one all themes share, so the same markup renders in any theme and only these values differ.

## Design notes (from the stylesheet header)

Verbatim from the top of the stylesheet. File names quoted in it may predate the `for-patients` / `for-practitioners` naming.

```text
Lily theme: night

Standalone Lily Design System theme — declares the theme tokens and inlines
the component CSS for all 492 Lily components, so this single file is the
only stylesheet required to render a Lily-styled page.

Credit for the theme source: DaisyUI (https://daisyui.com/)

Upstream tracked: DaisyUI v5-era theme palette, adapted to Lily tokens and hooks.
========================================================================= */

Theme tokens — the colour, radius, border, and depth variables consumed
by every Lily component rule below. The theme applies by default (`:root`)
and also when explicitly opted into via `<html data-theme="night">`,
so multiple themes can coexist in one document and be switched at runtime
by updating the `data-theme` attribute. */
```

## Usage

```html
<link rel="stylesheet" href="/themes/night.css" data-lily-theme-picker>
<html data-theme="night">
```

`theme-picker` loads this stylesheet by swapping the managed `<link>`'s `href` and setting `data-theme="night"` on the document root; `picker-bar` lists it by default. Installed from npm: `@lilydesignsystem/themes/night.css`. The stylesheet is standalone: every Lily component rule is inlined, in `@layer lily` with zero-specificity `:where()` selectors, so application CSS always wins.

## Related

- [Themes index](../../index.md) — the package contract.
- [AGENTS/theme.md](../../../../AGENTS/theme.md) — token shape and the headless forbidden list.
- [spec/theme](../../../../spec/theme/index.md) — the theme topic.
- [spec/theme-picker](../../../../spec/theme-picker/index.md) — runtime switching.
