# Fluent

Fluent 2 (Microsoft) light theme: brand blue (`#0f6cbd`) primary, Teams purple (`#5b5fc7`) secondary and a teal accent on white with Fluent's neutral backgrounds and strokes. 4px controls, 8px surfaces, light depth.

## At a glance

| | |
| --- | --- |
| Slug / `data-theme` | `fluent` |
| Stylesheet | [`themes/fluent.css`](../../../../themes/fluent.css) |
| Token source | [`themes/tokens/fluent.json`](../../../../themes/tokens/fluent.json) |
| Colour scheme | `light` |
| Group | Design-system reference |
| Primary | `#0f6cbd` (blue) |
| Page surface | `#ffffff` |
| Body text on page surface | `#242424`, 15.5:1 |
| Text pairs at AAA (7:1) | 4 of 11 |
| Text pairs below AA (4.5:1) | 0 of 11 |

## Upstream

- **Source:** Fluent (https://fluent2.microsoft.design/)
- **Tracks:** Fluent 2 web light theme (2026): brand ramp, neutral backgrounds and strokes, status colours.
- **Affiliation:** Independent implementation of public design tokens against Lily class hooks; not affiliated with or endorsed by the owner of the design system or its trademarks.

## Palette

| Token | Value | sRGB | Role |
| --- | --- | --- | --- |
| `--color-base-100` | `#ffffff` | `#ffffff` | page surface |
| `--color-base-200` | `#f5f5f5` | `#f5f5f5` | panels, cards, table headers |
| `--color-base-300` | `#e0e0e0` | `#e0e0e0` | dividers, hover rows, borders |
| `--color-base-content` | `#242424` | `#242424` | body text |
| `--color-primary` | `#0f6cbd` | `#0f6cbd` | primary action, focus intent |
| `--color-primary-content` | `#ffffff` | `#ffffff` | text on primary |
| `--color-secondary` | `#5b5fc7` | `#5b5fc7` | hover and secondary chrome |
| `--color-secondary-content` | `#ffffff` | `#ffffff` | text on secondary |
| `--color-accent` | `#038387` | `#038387` | sparing emphasis |
| `--color-accent-content` | `#ffffff` | `#ffffff` | text on accent |
| `--color-neutral` | `#333333` | `#333333` | footer, code, tooltips |
| `--color-neutral-content` | `#ffffff` | `#ffffff` | text on neutral |
| `--color-info` | `#0f6cbd` | `#0f6cbd` | informational |
| `--color-info-content` | `#ffffff` | `#ffffff` | text on info |
| `--color-success` | `#107c10` | `#107c10` | success, confirmation |
| `--color-success-content` | `#ffffff` | `#ffffff` | text on success |
| `--color-warning` | `#f7630c` | `#f7630c` | warning, caution |
| `--color-warning-content` | `#242424` | `#242424` | text on warning |
| `--color-error` | `#d13438` | `#d13438` | error, destructive |
| `--color-error-content` | `#ffffff` | `#ffffff` | text on error |

## Shape and depth

| Token | Value | Applied to |
| --- | --- | --- |
| `--radius-selector` | `0.25rem` (4px) | chips, badges, switches, checkbox and radio containers |
| `--radius-field` | `0.25rem` (4px) | inputs, buttons, menu items, tooltips |
| `--radius-box` | `0.5rem` (8px) | cards, dialogs, drawers, hero blocks |
| `--border` | `1px` | stroke weight everywhere |
| `--depth` | `1` | shadows on |
| `--noise` | `0` | no texture |

## Contrast

| Pair | Ratio | Level |
| --- | ---: | --- |
| `--color-base-content` on `--color-base-100` | 15.52:1 | AAA |
| `--color-base-content` on `--color-base-200` | 14.24:1 | AAA |
| `--color-base-content` on `--color-base-300` | 11.76:1 | AAA |
| `--color-primary-content` on `--color-primary` | 5.38:1 | AA |
| `--color-secondary-content` on `--color-secondary` | 5.38:1 | AA |
| `--color-accent-content` on `--color-accent` | 4.56:1 | AA |
| `--color-neutral-content` on `--color-neutral` | 12.63:1 | AAA |
| `--color-info-content` on `--color-info` | 5.38:1 | AA |
| `--color-success-content` on `--color-success` | 5.37:1 | AA |
| `--color-warning-content` on `--color-warning` | 4.99:1 | AA |
| `--color-error-content` on `--color-error` | 4.93:1 | AA |

4 of 11 text pairs reach AAA (7:1). Every pair reaches at least AA (4.5:1).

## Behaviour beyond the tokens

None. This theme changes only the token block above; every component rule below it is the one all themes share, so the same markup renders in any theme and only these values differ.

## Design notes (from the stylesheet header)

Verbatim from the top of the stylesheet. File names quoted in it may predate the `for-patients` / `for-practitioners` naming.

```text
Lily theme: fluent

Standalone Lily Design System theme — declares the theme tokens and inlines
the component CSS for all 492 Lily components, so this single file is the
only stylesheet required to render a Lily-styled page.

Credit for the theme source: Fluent (https://fluent2.microsoft.design/)

Upstream tracked: Fluent 2 web light theme (2026): brand ramp, neutral backgrounds and strokes, status colours.
========================================================================= */

Theme tokens — the colour, radius, border, and depth variables consumed
by every Lily component rule below. The theme applies by default (`:root`)
and also when explicitly opted into via `<html data-theme="light">`,
so multiple themes can coexist in one document and be switched at runtime
by updating the `data-theme` attribute. */
```

## Usage

```html
<link rel="stylesheet" href="/themes/fluent.css" data-lily-theme-picker>
<html data-theme="fluent">
```

`theme-picker` loads this stylesheet by swapping the managed `<link>`'s `href` and setting `data-theme="fluent"` on the document root; `picker-bar` lists it by default. Installed from npm: `@lilydesignsystem/themes/fluent.css`. The stylesheet is standalone: every Lily component rule is inlined, in `@layer lily` with zero-specificity `:where()` selectors, so application CSS always wins.

## Related

- [Themes index](../../index.md) — the package contract.
- [AGENTS/theme.md](../../../../AGENTS/theme.md) — token shape and the headless forbidden list.
- [spec/theme](../../../../spec/theme/index.md) — the theme topic.
- [spec/theme-picker](../../../../spec/theme-picker/index.md) — runtime switching.
