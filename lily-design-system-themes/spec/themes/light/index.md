# Light

The default light theme: white page, near-black text, violet primary (`#422ad5`), pink secondary and teal accent. The base the other DaisyUI-family themes are tuned against.

## At a glance

| | |
| --- | --- |
| Slug / `data-theme` | `light` |
| Stylesheet | [`themes/light.css`](../../../../themes/light.css) |
| Token source | [`themes/tokens/light.json`](../../../../themes/tokens/light.json) |
| Colour scheme | `light` |
| Group | General purpose (DaisyUI palette set) |
| Primary | `#422ad5` (violet) |
| Page surface | `#ffffff` |
| Body text on page surface | `#18181b`, 17.7:1 |
| Text pairs at AAA (7:1) | 4 of 11 |
| Text pairs below AA (4.5:1) | 1 of 11 |

## Upstream

- **Source:** DaisyUI (https://daisyui.com/)
- **Tracks:** DaisyUI v5-era theme palette, adapted to Lily tokens and hooks.

## Palette

| Token | Value | sRGB | Role |
| --- | --- | --- | --- |
| `--color-base-100` | `oklch(100% 0 0)` | `#ffffff` | page surface |
| `--color-base-200` | `oklch(98% 0 0)` | `#f8f8f8` | panels, cards, table headers |
| `--color-base-300` | `oklch(95% 0 0)` | `#eeeeee` | dividers, hover rows, borders |
| `--color-base-content` | `oklch(21% 0.006 285.885)` | `#18181b` | body text |
| `--color-primary` | `oklch(45% 0.24 277.023)` | `#422ad5` | primary action, focus intent |
| `--color-primary-content` | `oklch(93% 0.034 272.788)` | `#e0e7ff` | text on primary |
| `--color-secondary` | `oklch(65% 0.241 354.308)` | `#f43098` | hover and secondary chrome |
| `--color-secondary-content` | `oklch(94% 0.028 342.258)` | `#f9e4f0` | text on secondary |
| `--color-accent` | `oklch(77% 0.152 181.912)` | `#00d3bb` | sparing emphasis |
| `--color-accent-content` | `oklch(38% 0.063 188.416)` | `#084d49` | text on accent |
| `--color-neutral` | `oklch(14% 0.005 285.823)` | `#09090b` | footer, code, tooltips |
| `--color-neutral-content` | `oklch(92% 0.004 286.32)` | `#e4e4e7` | text on neutral |
| `--color-info` | `oklch(74% 0.16 232.661)` | `#00bafe` | informational |
| `--color-info-content` | `oklch(29% 0.066 243.157)` | `#042e49` | text on info |
| `--color-success` | `oklch(76% 0.177 163.223)` | `#00d390` | success, confirmation |
| `--color-success-content` | `oklch(37% 0.077 168.94)` | `#004c39` | text on success |
| `--color-warning` | `oklch(82% 0.189 84.429)` | `#fcb700` | warning, caution |
| `--color-warning-content` | `oklch(41% 0.112 45.904)` | `#793205` | text on warning |
| `--color-error` | `oklch(71% 0.194 13.428)` | `#ff627d` | error, destructive |
| `--color-error-content` | `oklch(27% 0.105 12.094)` | `#4d0218` | text on error |

## Shape and depth

| Token | Value | Applied to |
| --- | --- | --- |
| `--radius-selector` | `0.5rem` (8px) | chips, badges, switches, checkbox and radio containers |
| `--radius-field` | `0.25rem` (4px) | inputs, buttons, menu items, tooltips |
| `--radius-box` | `0.5rem` (8px) | cards, dialogs, drawers, hero blocks |
| `--border` | `1px` | stroke weight everywhere |
| `--depth` | `1` | shadows on |
| `--noise` | `0` | no texture |

## Contrast

| Pair | Ratio | Level |
| --- | ---: | --- |
| `--color-base-content` on `--color-base-100` | 17.72:1 | AAA |
| `--color-base-content` on `--color-base-200` | 16.68:1 | AAA |
| `--color-base-content` on `--color-base-300` | 15.27:1 | AAA |
| `--color-primary-content` on `--color-primary` | 6.75:1 | AA |
| `--color-secondary-content` on `--color-secondary` | 3.04:1 | AA large |
| `--color-accent-content` on `--color-accent` | 5.09:1 | AA |
| `--color-neutral-content` on `--color-neutral` | 15.68:1 | AAA |
| `--color-info-content` on `--color-info` | 6.34:1 | AA |
| `--color-success-content` on `--color-success` | 5.12:1 | AA |
| `--color-warning-content` on `--color-warning` | 5.24:1 | AA |
| `--color-error-content` on `--color-error` | 5.45:1 | AA |

4 of 11 text pairs reach AAA (7:1). Below AA (4.5:1): `--color-secondary-content` on `--color-secondary` 3.04:1. These are the theme author's colours; Lily never rewrites them, and `bin/check-theme --contrast` reports the same pairs.

## Behaviour beyond the tokens

None. This theme changes only the token block above; every component rule below it is the one all themes share, so the same markup renders in any theme and only these values differ.

## Design notes (from the stylesheet header)

Verbatim from the top of the stylesheet. File names quoted in it may predate the `for-patients` / `for-practitioners` naming.

```text
Lily theme: light

Standalone Lily Design System theme — declares the theme tokens and inlines
the component CSS for all 492 Lily components, so this single file is the
only stylesheet required to render a Lily-styled page.

Credit for the theme source: DaisyUI (https://daisyui.com/)

Upstream tracked: DaisyUI v5-era theme palette, adapted to Lily tokens and hooks.
========================================================================= */

Theme tokens — the colour, radius, border, and depth variables consumed
by every Lily component rule below. The theme applies by default (`:root`)
and also when explicitly opted into via `<html data-theme="light">`,
so multiple themes can coexist in one document and be switched at runtime
by updating the `data-theme` attribute. */
```

## Usage

```html
<link rel="stylesheet" href="/themes/light.css" data-lily-theme-picker>
<html data-theme="light">
```

`theme-picker` loads this stylesheet by swapping the managed `<link>`'s `href` and setting `data-theme="light"` on the document root; `picker-bar` lists it by default. Installed from npm: `@lilydesignsystem/themes/light.css`. The stylesheet is standalone: every Lily component rule is inlined, in `@layer lily` with zero-specificity `:where()` selectors, so application CSS always wins.

## Related

- [Themes index](../../index.md) — the package contract.
- [AGENTS/theme.md](../../../../AGENTS/theme.md) — token shape and the headless forbidden list.
- [spec/theme](../../../../spec/theme/index.md) — the theme topic.
- [spec/theme-picker](../../../../spec/theme-picker/index.md) — runtime switching.
