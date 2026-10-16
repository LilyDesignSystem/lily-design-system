# IBM Carbon

IBM Carbon White theme as a Lily theme: interactive blue (`#0f62fe`), grey-80 secondary, purple accent, support colours for status, `#161616` text on white with `#f4f4f4` layers. Carbon is square: every radius is 0, and surfaces are flat.

## At a glance

| | |
| --- | --- |
| Slug / `data-theme` | `ibm-carbon` |
| Stylesheet | [`themes/ibm-carbon.css`](../../../../themes/ibm-carbon.css) |
| Token source | [`themes/tokens/ibm-carbon.json`](../../../../themes/tokens/ibm-carbon.json) |
| Colour scheme | `light` |
| Group | Design-system reference |
| Primary | `#0f62fe` (blue) |
| Page surface | `#ffffff` |
| Body text on page surface | `#161616`, 18.1:1 |
| Text pairs at AAA (7:1) | 7 of 11 |
| Text pairs below AA (4.5:1) | 0 of 11 |

## Upstream

- **Source:** IBM Carbon (https://carbondesignsystem.com/)
- **Tracks:** IBM Carbon (v11, 2026) White theme: interactive blue, grey layers, support colours; square corners.
- **Affiliation:** Independent implementation of public design tokens against Lily class hooks; not affiliated with or endorsed by the owner of the design system or its trademarks.

## Palette

| Token | Value | sRGB | Role |
| --- | --- | --- | --- |
| `--color-base-100` | `#ffffff` | `#ffffff` | page surface |
| `--color-base-200` | `#f4f4f4` | `#f4f4f4` | panels, cards, table headers |
| `--color-base-300` | `#e0e0e0` | `#e0e0e0` | dividers, hover rows, borders |
| `--color-base-content` | `#161616` | `#161616` | body text |
| `--color-primary` | `#0f62fe` | `#0f62fe` | primary action, focus intent |
| `--color-primary-content` | `#ffffff` | `#ffffff` | text on primary |
| `--color-secondary` | `#393939` | `#393939` | hover and secondary chrome |
| `--color-secondary-content` | `#ffffff` | `#ffffff` | text on secondary |
| `--color-accent` | `#8a3ffc` | `#8a3ffc` | sparing emphasis |
| `--color-accent-content` | `#ffffff` | `#ffffff` | text on accent |
| `--color-neutral` | `#161616` | `#161616` | footer, code, tooltips |
| `--color-neutral-content` | `#ffffff` | `#ffffff` | text on neutral |
| `--color-info` | `#0043ce` | `#0043ce` | informational |
| `--color-info-content` | `#ffffff` | `#ffffff` | text on info |
| `--color-success` | `#198038` | `#198038` | success, confirmation |
| `--color-success-content` | `#ffffff` | `#ffffff` | text on success |
| `--color-warning` | `#f1c21b` | `#f1c21b` | warning, caution |
| `--color-warning-content` | `#161616` | `#161616` | text on warning |
| `--color-error` | `#da1e28` | `#da1e28` | error, destructive |
| `--color-error-content` | `#ffffff` | `#ffffff` | text on error |

## Shape and depth

| Token | Value | Applied to |
| --- | --- | --- |
| `--radius-selector` | `0rem` (0px) | chips, badges, switches, checkbox and radio containers |
| `--radius-field` | `0rem` (0px) | inputs, buttons, menu items, tooltips |
| `--radius-box` | `0rem` (0px) | cards, dialogs, drawers, hero blocks |
| `--border` | `1px` | stroke weight everywhere |
| `--depth` | `0` | flat: no shadows |
| `--noise` | `0` | no texture |

## Contrast

| Pair | Ratio | Level |
| --- | ---: | --- |
| `--color-base-content` on `--color-base-100` | 18.10:1 | AAA |
| `--color-base-content` on `--color-base-200` | 16.45:1 | AAA |
| `--color-base-content` on `--color-base-300` | 13.71:1 | AAA |
| `--color-primary-content` on `--color-primary` | 5.00:1 | AA |
| `--color-secondary-content` on `--color-secondary` | 11.55:1 | AAA |
| `--color-accent-content` on `--color-accent` | 5.00:1 | AA |
| `--color-neutral-content` on `--color-neutral` | 18.10:1 | AAA |
| `--color-info-content` on `--color-info` | 7.79:1 | AAA |
| `--color-success-content` on `--color-success` | 5.02:1 | AA |
| `--color-warning-content` on `--color-warning` | 10.75:1 | AAA |
| `--color-error-content` on `--color-error` | 5.00:1 | AA |

7 of 11 text pairs reach AAA (7:1). Every pair reaches at least AA (4.5:1).

## Behaviour beyond the tokens

None. This theme changes only the token block above; every component rule below it is the one all themes share, so the same markup renders in any theme and only these values differ.

## Design notes (from the stylesheet header)

Verbatim from the top of the stylesheet. File names quoted in it may predate the `for-patients` / `for-practitioners` naming.

```text
Lily theme: ibm-carbon

Standalone Lily Design System theme — declares the theme tokens and inlines
the component CSS for all 492 Lily components, so this single file is the
only stylesheet required to render a Lily-styled page.

Credit for the theme source: IBM Carbon (https://carbondesignsystem.com/)

Upstream tracked: IBM Carbon (v11, 2026) White theme: interactive blue, grey layers, support colours; square corners.
========================================================================= */

Theme tokens — the colour, radius, border, and depth variables consumed
by every Lily component rule below. The theme applies by default (`:root`)
and also when explicitly opted into via `<html data-theme="light">`,
so multiple themes can coexist in one document and be switched at runtime
by updating the `data-theme` attribute. */
```

## Usage

```html
<link rel="stylesheet" href="/themes/ibm-carbon.css" data-lily-theme-picker>
<html data-theme="ibm-carbon">
```

`theme-picker` loads this stylesheet by swapping the managed `<link>`'s `href` and setting `data-theme="ibm-carbon"` on the document root; `picker-bar` lists it by default. Installed from npm: `@lilydesignsystem/themes/ibm-carbon.css`. The stylesheet is standalone: every Lily component rule is inlined, in `@layer lily` with zero-specificity `:where()` selectors, so application CSS always wins.

## Related

- [Themes index](../../index.md) — the package contract.
- [AGENTS/theme.md](../../../../AGENTS/theme.md) — token shape and the headless forbidden list.
- [spec/theme](../../../../spec/theme/index.md) — the theme topic.
- [spec/theme-picker](../../../../spec/theme-picker/index.md) — runtime switching.
