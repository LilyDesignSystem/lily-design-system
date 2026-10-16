# Dim

Dark slate page (`#2a303c`) with a mint-green primary (`#9fe88d`), coral secondary and lavender accent. Flat, 1rem radii; a softer dark than `dark`.

## At a glance

| | |
| --- | --- |
| Slug / `data-theme` | `dim` |
| Stylesheet | [`themes/dim.css`](../../../../themes/dim.css) |
| Token source | [`themes/tokens/dim.json`](../../../../themes/tokens/dim.json) |
| Colour scheme | `dark` |
| Group | General purpose (DaisyUI palette set) |
| Primary | `#9fe88d` (green) |
| Page surface | `#2a303c` |
| Body text on page surface | `#b2ccd6`, 7.9:1 |
| Text pairs at AAA (7:1) | 11 of 11 |
| Text pairs below AA (4.5:1) | 0 of 11 |

## Upstream

- **Source:** DaisyUI (https://daisyui.com/)
- **Tracks:** DaisyUI v5-era theme palette, adapted to Lily tokens and hooks.

## Palette

| Token | Value | sRGB | Role |
| --- | --- | --- | --- |
| `--color-base-100` | `oklch(30.86% 0.023 264.149)` | `#2a303c` | page surface |
| `--color-base-200` | `oklch(28.04% 0.019 264.182)` | `#242933` | panels, cards, table headers |
| `--color-base-300` | `oklch(26.35% 0.018 262.177)` | `#20252e` | dividers, hover rows, borders |
| `--color-base-content` | `oklch(82.9% 0.031 222.959)` | `#b2ccd6` | body text |
| `--color-primary` | `oklch(86.13% 0.141 139.549)` | `#9fe88d` | primary action, focus intent |
| `--color-primary-content` | `oklch(17.23% 0.028 139.549)` | `#091307` | text on primary |
| `--color-secondary` | `oklch(73.38% 0.165 35.353)` | `#ff7d5d` | hover and secondary chrome |
| `--color-secondary-content` | `oklch(14.68% 0.033 35.353)` | `#160503` | text on secondary |
| `--color-accent` | `oklch(74.23% 0.133 311.379)` | `#c792e9` | sparing emphasis |
| `--color-accent-content` | `oklch(14.84% 0.026 311.379)` | `#0e0813` | text on accent |
| `--color-neutral` | `oklch(24.73% 0.02 264.094)` | `#1c212b` | footer, code, tooltips |
| `--color-neutral-content` | `oklch(82.9% 0.031 222.959)` | `#b2ccd6` | text on neutral |
| `--color-info` | `oklch(86.08% 0.142 206.182)` | `#28ebff` | informational |
| `--color-info-content` | `oklch(17.21% 0.028 206.182)` | `#011316` | text on info |
| `--color-success` | `oklch(86.17% 0.142 166.534)` | `#62efbd` | success, confirmation |
| `--color-success-content` | `oklch(17.23% 0.028 166.534)` | `#03140d` | text on success |
| `--color-warning` | `oklch(86.16% 0.142 94.818)` | `#efd057` | warning, caution |
| `--color-warning-content` | `oklch(17.23% 0.028 94.818)` | `#141003` | text on warning |
| `--color-error` | `oklch(82.42% 0.099 33.756)` | `#ffae9b` | error, destructive |
| `--color-error-content` | `oklch(16.48% 0.019 33.756)` | `#160b09` | text on error |

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
| `--color-base-content` on `--color-base-100` | 7.88:1 | AAA |
| `--color-base-content` on `--color-base-200` | 8.68:1 | AAA |
| `--color-base-content` on `--color-base-300` | 9.16:1 | AAA |
| `--color-primary-content` on `--color-primary` | 13.00:1 | AAA |
| `--color-secondary-content` on `--color-secondary` | 7.89:1 | AAA |
| `--color-accent-content` on `--color-accent` | 8.20:1 | AAA |
| `--color-neutral-content` on `--color-neutral` | 9.60:1 | AAA |
| `--color-info-content` on `--color-info` | 13.04:1 | AAA |
| `--color-success-content` on `--color-success` | 13.16:1 | AAA |
| `--color-warning-content` on `--color-warning` | 12.51:1 | AAA |
| `--color-error-content` on `--color-error` | 10.85:1 | AAA |

11 of 11 text pairs reach AAA (7:1). Every pair reaches at least AA (4.5:1).

## Behaviour beyond the tokens

None. This theme changes only the token block above; every component rule below it is the one all themes share, so the same markup renders in any theme and only these values differ.

## Design notes (from the stylesheet header)

Verbatim from the top of the stylesheet. File names quoted in it may predate the `for-patients` / `for-practitioners` naming.

```text
Lily theme: dim

Standalone Lily Design System theme — declares the theme tokens and inlines
the component CSS for all 492 Lily components, so this single file is the
only stylesheet required to render a Lily-styled page.

Credit for the theme source: DaisyUI (https://daisyui.com/)

Upstream tracked: DaisyUI v5-era theme palette, adapted to Lily tokens and hooks.
========================================================================= */

Theme tokens — the colour, radius, border, and depth variables consumed
by every Lily component rule below. The theme applies by default (`:root`)
and also when explicitly opted into via `<html data-theme="dim">`,
so multiple themes can coexist in one document and be switched at runtime
by updating the `data-theme` attribute. */
```

## Usage

```html
<link rel="stylesheet" href="/themes/dim.css" data-lily-theme-picker>
<html data-theme="dim">
```

`theme-picker` loads this stylesheet by swapping the managed `<link>`'s `href` and setting `data-theme="dim"` on the document root; `picker-bar` lists it by default. Installed from npm: `@lilydesignsystem/themes/dim.css`. The stylesheet is standalone: every Lily component rule is inlined, in `@layer lily` with zero-specificity `:where()` selectors, so application CSS always wins.

## Related

- [Themes index](../../index.md) — the package contract.
- [AGENTS/theme.md](../../../../AGENTS/theme.md) — token shape and the headless forbidden list.
- [spec/theme](../../../../spec/theme/index.md) — the theme topic.
- [spec/theme-picker](../../../../spec/theme-picker/index.md) — runtime switching.
