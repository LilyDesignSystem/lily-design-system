# Halloween

Dark brown-black page (`#1b1816`) with an orange primary (`#ff8f00`), purple secondary and green accent. Shadows on, 1rem box radius.

## At a glance

| | |
| --- | --- |
| Slug / `data-theme` | `halloween` |
| Stylesheet | [`themes/halloween.css`](../../../../themes/halloween.css) |
| Token source | [`themes/tokens/halloween.json`](../../../../themes/tokens/halloween.json) |
| Colour scheme | `dark` |
| Group | General purpose (DaisyUI palette set) |
| Primary | `#ff8f00` (yellow) |
| Page surface | `#1b1816` |
| Body text on page surface | `#cdcdcd`, 11.1:1 |
| Text pairs at AAA (7:1) | 5 of 11 |
| Text pairs below AA (4.5:1) | 1 of 11 |

## Upstream

- **Source:** DaisyUI (https://daisyui.com/)
- **Tracks:** DaisyUI v5-era theme palette, adapted to Lily tokens and hooks.

## Palette

| Token | Value | sRGB | Role |
| --- | --- | --- | --- |
| `--color-base-100` | `oklch(21% 0.006 56.043)` | `#1b1816` | page surface |
| `--color-base-200` | `oklch(14% 0.004 49.25)` | `#0b0908` | panels, cards, table headers |
| `--color-base-300` | `oklch(0% 0 0)` | `#000000` | dividers, hover rows, borders |
| `--color-base-content` | `oklch(84.96% 0 0)` | `#cdcdcd` | body text |
| `--color-primary` | `oklch(77.48% 0.204 60.62)` | `#ff8f00` | primary action, focus intent |
| `--color-primary-content` | `oklch(19.69% 0.004 196.779)` | `#131616` | text on primary |
| `--color-secondary` | `oklch(45.98% 0.248 305.03)` | `#7a00c2` | hover and secondary chrome |
| `--color-secondary-content` | `oklch(89.2% 0.049 305.03)` | `#e3d4f6` | text on secondary |
| `--color-accent` | `oklch(64.8% 0.223 136.073)` | `#42aa00` | sparing emphasis |
| `--color-accent-content` | `oklch(0% 0 0)` | `#000000` | text on accent |
| `--color-neutral` | `oklch(24.37% 0.046 65.681)` | `#2f1b05` | footer, code, tooltips |
| `--color-neutral-content` | `oklch(84.87% 0.009 65.681)` | `#d2ccc7` | text on neutral |
| `--color-info` | `oklch(54.62% 0.215 262.88)` | `#2563eb` | informational |
| `--color-info-content` | `oklch(90.92% 0.043 262.88)` | `#d2e2ff` | text on info |
| `--color-success` | `oklch(62.7% 0.169 149.213)` | `#18a34a` | success, confirmation |
| `--color-success-content` | `oklch(12.54% 0.033 149.213)` | `#000a02` | text on success |
| `--color-warning` | `oklch(66.58% 0.157 58.318)` | `#d97708` | warning, caution |
| `--color-warning-content` | `oklch(13.32% 0.031 58.318)` | `#110500` | text on warning |
| `--color-error` | `oklch(65.72% 0.199 27.33)` | `#f35248` | error, destructive |
| `--color-error-content` | `oklch(13.14% 0.039 27.33)` | `#140202` | text on error |

## Shape and depth

| Token | Value | Applied to |
| --- | --- | --- |
| `--radius-selector` | `1rem` (16px) | chips, badges, switches, checkbox and radio containers |
| `--radius-field` | `0.5rem` (8px) | inputs, buttons, menu items, tooltips |
| `--radius-box` | `1rem` (16px) | cards, dialogs, drawers, hero blocks |
| `--border` | `1px` | stroke weight everywhere |
| `--depth` | `1` | shadows on |
| `--noise` | `0` | no texture |

## Contrast

| Pair | Ratio | Level |
| --- | ---: | --- |
| `--color-base-content` on `--color-base-100` | 11.11:1 | AAA |
| `--color-base-content` on `--color-base-200` | 12.50:1 | AAA |
| `--color-base-content` on `--color-base-300` | 13.21:1 | AAA |
| `--color-primary-content` on `--color-primary` | 7.96:1 | AAA |
| `--color-secondary-content` on `--color-secondary` | 5.76:1 | AA |
| `--color-accent-content` on `--color-accent` | 6.98:1 | AA |
| `--color-neutral-content` on `--color-neutral` | 10.32:1 | AAA |
| `--color-info-content` on `--color-info` | 3.95:1 | AA large |
| `--color-success-content` on `--color-success` | 6.11:1 | AA |
| `--color-warning-content` on `--color-warning` | 6.31:1 | AA |
| `--color-error-content` on `--color-error` | 5.88:1 | AA |

5 of 11 text pairs reach AAA (7:1). Below AA (4.5:1): `--color-info-content` on `--color-info` 3.95:1. These are the theme author's colours; Lily never rewrites them, and `bin/check-theme --contrast` reports the same pairs.

## Behaviour beyond the tokens

None. This theme changes only the token block above; every component rule below it is the one all themes share, so the same markup renders in any theme and only these values differ.

## Design notes (from the stylesheet header)

Verbatim from the top of the stylesheet. File names quoted in it may predate the `for-patients` / `for-practitioners` naming.

```text
Lily theme: halloween

Standalone Lily Design System theme — declares the theme tokens and inlines
the component CSS for all 492 Lily components, so this single file is the
only stylesheet required to render a Lily-styled page.

Credit for the theme source: DaisyUI (https://daisyui.com/)

Upstream tracked: DaisyUI v5-era theme palette, adapted to Lily tokens and hooks.
========================================================================= */

Theme tokens — the colour, radius, border, and depth variables consumed
by every Lily component rule below. The theme applies by default (`:root`)
and also when explicitly opted into via `<html data-theme="halloween">`,
so multiple themes can coexist in one document and be switched at runtime
by updating the `data-theme` attribute. */
```

## Usage

```html
<link rel="stylesheet" href="/themes/halloween.css" data-lily-theme-picker>
<html data-theme="halloween">
```

`theme-picker` loads this stylesheet by swapping the managed `<link>`'s `href` and setting `data-theme="halloween"` on the document root; `picker-bar` lists it by default. Installed from npm: `@lilydesignsystem/themes/halloween.css`. The stylesheet is standalone: every Lily component rule is inlined, in `@layer lily` with zero-specificity `:where()` selectors, so application CSS always wins.

## Related

- [Themes index](../../index.md) — the package contract.
- [AGENTS/theme.md](../../../../AGENTS/theme.md) — token shape and the headless forbidden list.
- [spec/theme](../../../../spec/theme/index.md) — the theme topic.
- [spec/theme-picker](../../../../spec/theme-picker/index.md) — runtime switching.
