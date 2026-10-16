# United States Web Design System

U.S. Web Design System as a Lily theme: the USWDS blue (`#005ea2`) primary, a cool grey (`#565c65`) secondary and a cyan accent (`#00bde3`), with 2px fields and 4px boxes and light shadows. A plain, accessible federal-government look.

## At a glance

| | |
| --- | --- |
| Slug / `data-theme` | `united-states-web-design-system` |
| Stylesheet | [`themes/united-states-web-design-system.css`](../../../../themes/united-states-web-design-system.css) |
| Token source | [`themes/tokens/united-states-web-design-system.json`](../../../../themes/tokens/united-states-web-design-system.json) |
| Colour scheme | `light` |
| Group | UK and US government (listed last in `picker-bar`) |
| Primary | `#005ea2` (blue) |
| Page surface | `#ffffff` |
| Body text on page surface | `#1b1b1b`, 17.2:1 |
| Text pairs at AAA (7:1) | 7 of 11 |
| Text pairs below AA (4.5:1) | 1 of 11 |

## Upstream

- **Source:** U.S. Web Design System (https://designsystem.digital.gov/)
- **Affiliation:** Independent implementation against Lily class hooks; not affiliated with or endorsed by GSA, 18F or the U.S. Government.

## Palette

| Token | Value | sRGB | Role |
| --- | --- | --- | --- |
| `--color-base-100` | `#ffffff` | `#ffffff` | page surface |
| `--color-base-200` | `#f0f0f0` | `#f0f0f0` | panels, cards, table headers |
| `--color-base-300` | `#dfe1e2` | `#dfe1e2` | dividers, hover rows, borders |
| `--color-base-content` | `#1b1b1b` | `#1b1b1b` | body text |
| `--color-primary` | `#005ea2` | `#005ea2` | primary action, focus intent |
| `--color-primary-content` | `#ffffff` | `#ffffff` | text on primary |
| `--color-secondary` | `#565c65` | `#565c65` | hover and secondary chrome |
| `--color-secondary-content` | `#ffffff` | `#ffffff` | text on secondary |
| `--color-accent` | `#00bde3` | `#00bde3` | sparing emphasis |
| `--color-accent-content` | `#1b1b1b` | `#1b1b1b` | text on accent |
| `--color-neutral` | `#1b1b1b` | `#1b1b1b` | footer, code, tooltips |
| `--color-neutral-content` | `#ffffff` | `#ffffff` | text on neutral |
| `--color-info` | `#00bde3` | `#00bde3` | informational |
| `--color-info-content` | `#1b1b1b` | `#1b1b1b` | text on info |
| `--color-success` | `#00a91c` | `#00a91c` | success, confirmation |
| `--color-success-content` | `#ffffff` | `#ffffff` | text on success |
| `--color-warning` | `#ffbe2e` | `#ffbe2e` | warning, caution |
| `--color-warning-content` | `#1b1b1b` | `#1b1b1b` | text on warning |
| `--color-error` | `#d83933` | `#d83933` | error, destructive |
| `--color-error-content` | `#ffffff` | `#ffffff` | text on error |

## Shape and depth

| Token | Value | Applied to |
| --- | --- | --- |
| `--radius-selector` | `0.25rem` (4px) | chips, badges, switches, checkbox and radio containers |
| `--radius-field` | `0.125rem` (2px) | inputs, buttons, menu items, tooltips |
| `--radius-box` | `0.25rem` (4px) | cards, dialogs, drawers, hero blocks |
| `--border` | `1px` | stroke weight everywhere |
| `--depth` | `1` | shadows on |
| `--noise` | `0` | no texture |

## Contrast

| Pair | Ratio | Level |
| --- | ---: | --- |
| `--color-base-content` on `--color-base-100` | 17.22:1 | AAA |
| `--color-base-content` on `--color-base-200` | 15.11:1 | AAA |
| `--color-base-content` on `--color-base-300` | 13.13:1 | AAA |
| `--color-primary-content` on `--color-primary` | 6.72:1 | AA |
| `--color-secondary-content` on `--color-secondary` | 6.74:1 | AA |
| `--color-accent-content` on `--color-accent` | 7.70:1 | AAA |
| `--color-neutral-content` on `--color-neutral` | 17.22:1 | AAA |
| `--color-info-content` on `--color-info` | 7.70:1 | AAA |
| `--color-success-content` on `--color-success` | 3.14:1 | AA large |
| `--color-warning-content` on `--color-warning` | 10.38:1 | AAA |
| `--color-error-content` on `--color-error` | 4.61:1 | AA |

7 of 11 text pairs reach AAA (7:1). Below AA (4.5:1): `--color-success-content` on `--color-success` 3.14:1. These are the theme author's colours; Lily never rewrites them, and `bin/check-theme --contrast` reports the same pairs.

## Behaviour beyond the tokens

None. This theme changes only the token block above; every component rule below it is the one all themes share, so the same markup renders in any theme and only these values differ.

## Usage

```html
<link rel="stylesheet" href="/themes/united-states-web-design-system.css" data-lily-theme-picker>
<html data-theme="united-states-web-design-system">
```

`theme-picker` loads this stylesheet by swapping the managed `<link>`'s `href` and setting `data-theme="united-states-web-design-system"` on the document root; `picker-bar` lists it by default. Installed from npm: `@lilydesignsystem/themes/united-states-web-design-system.css`. The stylesheet is standalone: every Lily component rule is inlined, in `@layer lily` with zero-specificity `:where()` selectors, so application CSS always wins.

## Related

- [Themes index](../../index.md) — the package contract.
- [AGENTS/theme.md](../../../../AGENTS/theme.md) — token shape and the headless forbidden list.
- [spec/theme](../../../../spec/theme/index.md) — the theme topic.
- [spec/theme-picker](../../../../spec/theme-picker/index.md) — runtime switching.
