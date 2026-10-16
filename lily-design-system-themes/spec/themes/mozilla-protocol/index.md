# Mozilla Protocol

Mozilla Protocol design tokens as a Lily theme: Firefox blue (`#0060df`) primary, violet secondary (`#9059ff`) and a pink accent (`#ff4aa2`) on white, 4px fields and 8px boxes, shadows on.

## At a glance

| | |
| --- | --- |
| Slug / `data-theme` | `mozilla-protocol` |
| Stylesheet | [`themes/mozilla-protocol.css`](../../../../themes/mozilla-protocol.css) |
| Token source | [`themes/tokens/mozilla-protocol.json`](../../../../themes/tokens/mozilla-protocol.json) |
| Colour scheme | `light` |
| Group | Design-system reference |
| Primary | `#0060df` (blue) |
| Page surface | `#ffffff` |
| Body text on page surface | `#20123a`, 17.4:1 |
| Text pairs at AAA (7:1) | 6 of 11 |
| Text pairs below AA (4.5:1) | 2 of 11 |

## Upstream

- **Source:** Mozilla Protocol Design System (https://protocol.mozilla.org/)
- **Tracks:** Mozilla Protocol v18-era design tokens.
- **Affiliation:** Independent implementation against Lily class hooks; not affiliated with or endorsed by Mozilla.

## Palette

| Token | Value | sRGB | Role |
| --- | --- | --- | --- |
| `--color-base-100` | `#ffffff` | `#ffffff` | page surface |
| `--color-base-200` | `#f9f9fb` | `#f9f9fb` | panels, cards, table headers |
| `--color-base-300` | `#e0e0e6` | `#e0e0e6` | dividers, hover rows, borders |
| `--color-base-content` | `#20123a` | `#20123a` | body text |
| `--color-primary` | `#0060df` | `#0060df` | primary action, focus intent |
| `--color-primary-content` | `#ffffff` | `#ffffff` | text on primary |
| `--color-secondary` | `#9059ff` | `#9059ff` | hover and secondary chrome |
| `--color-secondary-content` | `#ffffff` | `#ffffff` | text on secondary |
| `--color-accent` | `#ff4aa2` | `#ff4aa2` | sparing emphasis |
| `--color-accent-content` | `#ffffff` | `#ffffff` | text on accent |
| `--color-neutral` | `#20123a` | `#20123a` | footer, code, tooltips |
| `--color-neutral-content` | `#ffffff` | `#ffffff` | text on neutral |
| `--color-info` | `#0060df` | `#0060df` | informational |
| `--color-info-content` | `#ffffff` | `#ffffff` | text on info |
| `--color-success` | `#3fe1b0` | `#3fe1b0` | success, confirmation |
| `--color-success-content` | `#15141a` | `#15141a` | text on success |
| `--color-warning` | `#ffa436` | `#ffa436` | warning, caution |
| `--color-warning-content` | `#15141a` | `#15141a` | text on warning |
| `--color-error` | `#d70022` | `#d70022` | error, destructive |
| `--color-error-content` | `#ffffff` | `#ffffff` | text on error |

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
| `--color-base-content` on `--color-base-100` | 17.37:1 | AAA |
| `--color-base-content` on `--color-base-200` | 16.52:1 | AAA |
| `--color-base-content` on `--color-base-300` | 13.21:1 | AAA |
| `--color-primary-content` on `--color-primary` | 5.62:1 | AA |
| `--color-secondary-content` on `--color-secondary` | 4.15:1 | AA large |
| `--color-accent-content` on `--color-accent` | 3.11:1 | AA large |
| `--color-neutral-content` on `--color-neutral` | 17.37:1 | AAA |
| `--color-info-content` on `--color-info` | 5.62:1 | AA |
| `--color-success-content` on `--color-success` | 10.99:1 | AAA |
| `--color-warning-content` on `--color-warning` | 9.26:1 | AAA |
| `--color-error-content` on `--color-error` | 5.37:1 | AA |

6 of 11 text pairs reach AAA (7:1). Below AA (4.5:1): `--color-secondary-content` on `--color-secondary` 4.15:1; `--color-accent-content` on `--color-accent` 3.11:1. These are the theme author's colours; Lily never rewrites them, and `bin/check-theme --contrast` reports the same pairs.

## Behaviour beyond the tokens

None. This theme changes only the token block above; every component rule below it is the one all themes share, so the same markup renders in any theme and only these values differ.

## Design notes (from the stylesheet header)

Verbatim from the top of the stylesheet. File names quoted in it may predate the `for-patients` / `for-practitioners` naming.

```text
Lily theme: mozilla-protocol

Standalone Lily Design System theme — declares the theme tokens and inlines
the component CSS for all 492 Lily components, so this single file is the
only stylesheet required to render a Lily-styled page.

Credit for the theme source: Mozilla Protocol Design System (https://protocol.mozilla.org/)

Upstream tracked: Mozilla Protocol v18-era design tokens.
========================================================================= */

Theme tokens — the colour, radius, border, and depth variables consumed
by every Lily component rule below. The theme applies by default (`:root`)
and also when explicitly opted into via `<html data-theme="light">`,
so multiple themes can coexist in one document and be switched at runtime
by updating the `data-theme` attribute. */
```

## Usage

```html
<link rel="stylesheet" href="/themes/mozilla-protocol.css" data-lily-theme-picker>
<html data-theme="mozilla-protocol">
```

`theme-picker` loads this stylesheet by swapping the managed `<link>`'s `href` and setting `data-theme="mozilla-protocol"` on the document root; `picker-bar` lists it by default. Installed from npm: `@lilydesignsystem/themes/mozilla-protocol.css`. The stylesheet is standalone: every Lily component rule is inlined, in `@layer lily` with zero-specificity `:where()` selectors, so application CSS always wins.

## Related

- [Themes index](../../index.md) — the package contract.
- [AGENTS/theme.md](../../../../AGENTS/theme.md) — token shape and the headless forbidden list.
- [spec/theme](../../../../spec/theme/index.md) — the theme topic.
- [spec/theme-picker](../../../../spec/theme-picker/index.md) — runtime switching.
