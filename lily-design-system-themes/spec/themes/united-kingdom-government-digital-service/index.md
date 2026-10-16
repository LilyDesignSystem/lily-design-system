# United Kingdom Government Digital Service

GOV.UK Design System as a Lily theme: the GDS blue (`#1d70b8`) primary, dark-blue secondary (`#003078`), the high-contrast focus yellow (`#ffdd00`) as accent, black text (`#0b0c0c`) and square corners with no shadows. Tracks GOV.UK Frontend v6.x, including the v6 changes to success green (`#0f7a52`) and error red (`#ca3535`).

## At a glance

| | |
| --- | --- |
| Slug / `data-theme` | `united-kingdom-government-digital-service` |
| Stylesheet | [`themes/united-kingdom-government-digital-service.css`](../../../../themes/united-kingdom-government-digital-service.css) |
| Token source | [`themes/tokens/united-kingdom-government-digital-service.json`](../../../../themes/tokens/united-kingdom-government-digital-service.json) |
| Colour scheme | `light` |
| Group | UK and US government (listed last in `picker-bar`) |
| Primary | `#1d70b8` (blue) |
| Page surface | `#ffffff` |
| Body text on page surface | `#0b0c0c`, 19.6:1 |
| Text pairs at AAA (7:1) | 7 of 11 |
| Text pairs below AA (4.5:1) | 0 of 11 |

## Upstream

- **Source:** GOV.UK Design System / Government Digital Service (https://design-system.service.gov.uk/)
- **Tracks:** GOV.UK Frontend v6.x (web palette v1.0, 2026). Refreshed 2026-08-26 for the v6.0.0 palette changes that touch tokens used here: green #00703c -> #0f7a52 (success), red #d4351c -> #ca3535 (error). Blue #1d70b8, black #0b0c0c, and focus yellow #ffdd00 are unchanged in v6. Independent implementation against Lily class hooks; not affiliated with or endorsed by GDS.
- **Affiliation:** Independent implementation against Lily class hooks; not affiliated with or endorsed by GDS or the UK Government.

## Palette

| Token | Value | sRGB | Role |
| --- | --- | --- | --- |
| `--color-base-100` | `#ffffff` | `#ffffff` | page surface |
| `--color-base-200` | `#f3f2f1` | `#f3f2f1` | panels, cards, table headers |
| `--color-base-300` | `#dee0e2` | `#dee0e2` | dividers, hover rows, borders |
| `--color-base-content` | `#0b0c0c` | `#0b0c0c` | body text |
| `--color-primary` | `#1d70b8` | `#1d70b8` | primary action, focus intent |
| `--color-primary-content` | `#ffffff` | `#ffffff` | text on primary |
| `--color-secondary` | `#003078` | `#003078` | hover and secondary chrome |
| `--color-secondary-content` | `#ffffff` | `#ffffff` | text on secondary |
| `--color-accent` | `#ffdd00` | `#ffdd00` | sparing emphasis |
| `--color-accent-content` | `#0b0c0c` | `#0b0c0c` | text on accent |
| `--color-neutral` | `#0b0c0c` | `#0b0c0c` | footer, code, tooltips |
| `--color-neutral-content` | `#ffffff` | `#ffffff` | text on neutral |
| `--color-info` | `#1d70b8` | `#1d70b8` | informational |
| `--color-info-content` | `#ffffff` | `#ffffff` | text on info |
| `--color-success` | `#0f7a52` | `#0f7a52` | success, confirmation |
| `--color-success-content` | `#ffffff` | `#ffffff` | text on success |
| `--color-warning` | `#f47738` | `#f47738` | warning, caution |
| `--color-warning-content` | `#0b0c0c` | `#0b0c0c` | text on warning |
| `--color-error` | `#ca3535` | `#ca3535` | error, destructive |
| `--color-error-content` | `#ffffff` | `#ffffff` | text on error |

## Shape and depth

| Token | Value | Applied to |
| --- | --- | --- |
| `--radius-selector` | `0` (0) | chips, badges, switches, checkbox and radio containers |
| `--radius-field` | `0` (0) | inputs, buttons, menu items, tooltips |
| `--radius-box` | `0` (0) | cards, dialogs, drawers, hero blocks |
| `--border` | `1px` | stroke weight everywhere |
| `--depth` | `0` | flat: no shadows |
| `--noise` | `0` | no texture |

## Contrast

| Pair | Ratio | Level |
| --- | ---: | --- |
| `--color-base-content` on `--color-base-100` | 19.59:1 | AAA |
| `--color-base-content` on `--color-base-200` | 17.52:1 | AAA |
| `--color-base-content` on `--color-base-300` | 14.80:1 | AAA |
| `--color-primary-content` on `--color-primary` | 5.17:1 | AA |
| `--color-secondary-content` on `--color-secondary` | 12.40:1 | AAA |
| `--color-accent-content` on `--color-accent` | 14.55:1 | AAA |
| `--color-neutral-content` on `--color-neutral` | 19.59:1 | AAA |
| `--color-info-content` on `--color-info` | 5.17:1 | AA |
| `--color-success-content` on `--color-success` | 5.35:1 | AA |
| `--color-warning-content` on `--color-warning` | 7.04:1 | AAA |
| `--color-error-content` on `--color-error` | 5.16:1 | AA |

7 of 11 text pairs reach AAA (7:1). Every pair reaches at least AA (4.5:1).

## Behaviour beyond the tokens

None. This theme changes only the token block above; every component rule below it is the one all themes share, so the same markup renders in any theme and only these values differ.

## Design notes (from the stylesheet header)

Verbatim from the top of the stylesheet. File names quoted in it may predate the `for-patients` / `for-practitioners` naming.

```text
Lily theme: united-kingdom-government-digital-service

Standalone Lily Design System theme — declares the theme tokens and inlines
the component CSS for all 492 Lily components, so this single file is the
only stylesheet required to render a Lily-styled page.

Credit for the theme source: GOV.UK Design System / Government Digital Service (https://design-system.service.gov.uk/)

Upstream tracked: GOV.UK Frontend v6.x (web palette v1.0, 2026).
Refreshed 2026-08-26 for the v6.0.0 palette changes that touch tokens
used here: green #00703c -> #0f7a52 (success), red #d4351c -> #ca3535
(error). Blue #1d70b8, black #0b0c0c, and focus yellow #ffdd00 are
unchanged in v6. Independent implementation against Lily class hooks;
not affiliated with or endorsed by GDS.
========================================================================= */

Theme tokens — the colour, radius, border, and depth variables consumed
by every Lily component rule below. The theme applies by default (`:root`)
and also when explicitly opted into via `<html data-theme="light">`,
so multiple themes can coexist in one document and be switched at runtime
by updating the `data-theme` attribute. */
```

## Usage

```html
<link rel="stylesheet" href="/themes/united-kingdom-government-digital-service.css" data-lily-theme-picker>
<html data-theme="united-kingdom-government-digital-service">
```

`theme-picker` loads this stylesheet by swapping the managed `<link>`'s `href` and setting `data-theme="united-kingdom-government-digital-service"` on the document root; `picker-bar` lists it by default. Installed from npm: `@lilydesignsystem/themes/united-kingdom-government-digital-service.css`. The stylesheet is standalone: every Lily component rule is inlined, in `@layer lily` with zero-specificity `:where()` selectors, so application CSS always wins.

## Related

- [Themes index](../../index.md) — the package contract.
- [AGENTS/theme.md](../../../../AGENTS/theme.md) — token shape and the headless forbidden list.
- [spec/theme](../../../../spec/theme/index.md) — the theme topic.
- [spec/theme-picker](../../../../spec/theme-picker/index.md) — runtime switching.
