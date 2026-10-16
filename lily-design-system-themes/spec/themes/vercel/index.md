# Vercel

Vercel Geist light theme as a Lily theme: a black primary (`#000000`) with white text, Vercel blue secondary (`#0070f3`) and a hot-pink accent on white with the `#fafafa` secondary surface and `#ebebeb` border. 6px radii, a 12px box radius and no shadows.

## At a glance

| | |
| --- | --- |
| Slug / `data-theme` | `vercel` |
| Stylesheet | [`themes/vercel.css`](../../../../themes/vercel.css) |
| Token source | [`themes/tokens/vercel.json`](../../../../themes/tokens/vercel.json) |
| Colour scheme | `light` |
| Group | Design-system reference |
| Primary | `#000000` (neutral grey) |
| Page surface | `#ffffff` |
| Body text on page surface | `#171717`, 17.9:1 |
| Text pairs at AAA (7:1) | 6 of 11 |
| Text pairs below AA (4.5:1) | 0 of 11 |

## Upstream

- **Source:** Vercel (https://vercel.com/geist)
- **Tracks:** Vercel Geist (2026) light colours: black primary, grey scale, blue link, status colours.
- **Affiliation:** Independent implementation of public design tokens against Lily class hooks; not affiliated with or endorsed by the owner of the design system or its trademarks.

## Palette

| Token | Value | sRGB | Role |
| --- | --- | --- | --- |
| `--color-base-100` | `#ffffff` | `#ffffff` | page surface |
| `--color-base-200` | `#fafafa` | `#fafafa` | panels, cards, table headers |
| `--color-base-300` | `#ebebeb` | `#ebebeb` | dividers, hover rows, borders |
| `--color-base-content` | `#171717` | `#171717` | body text |
| `--color-primary` | `#000000` | `#000000` | primary action, focus intent |
| `--color-primary-content` | `#ffffff` | `#ffffff` | text on primary |
| `--color-secondary` | `#0070f3` | `#0070f3` | hover and secondary chrome |
| `--color-secondary-content` | `#ffffff` | `#ffffff` | text on secondary |
| `--color-accent` | `#ff0080` | `#ff0080` | sparing emphasis |
| `--color-accent-content` | `#171717` | `#171717` | text on accent |
| `--color-neutral` | `#000000` | `#000000` | footer, code, tooltips |
| `--color-neutral-content` | `#ffffff` | `#ffffff` | text on neutral |
| `--color-info` | `#0070f3` | `#0070f3` | informational |
| `--color-info-content` | `#ffffff` | `#ffffff` | text on info |
| `--color-success` | `#45a557` | `#45a557` | success, confirmation |
| `--color-success-content` | `#171717` | `#171717` | text on success |
| `--color-warning` | `#f5a623` | `#f5a623` | warning, caution |
| `--color-warning-content` | `#171717` | `#171717` | text on warning |
| `--color-error` | `#ee0000` | `#ee0000` | error, destructive |
| `--color-error-content` | `#ffffff` | `#ffffff` | text on error |

## Shape and depth

| Token | Value | Applied to |
| --- | --- | --- |
| `--radius-selector` | `0.375rem` (6px) | chips, badges, switches, checkbox and radio containers |
| `--radius-field` | `0.375rem` (6px) | inputs, buttons, menu items, tooltips |
| `--radius-box` | `0.75rem` (12px) | cards, dialogs, drawers, hero blocks |
| `--border` | `1px` | stroke weight everywhere |
| `--depth` | `0` | flat: no shadows |
| `--noise` | `0` | no texture |

## Contrast

| Pair | Ratio | Level |
| --- | ---: | --- |
| `--color-base-content` on `--color-base-100` | 17.93:1 | AAA |
| `--color-base-content` on `--color-base-200` | 17.18:1 | AAA |
| `--color-base-content` on `--color-base-300` | 15.04:1 | AAA |
| `--color-primary-content` on `--color-primary` | 21.00:1 | AAA |
| `--color-secondary-content` on `--color-secondary` | 4.55:1 | AA |
| `--color-accent-content` on `--color-accent` | 4.75:1 | AA |
| `--color-neutral-content` on `--color-neutral` | 21.00:1 | AAA |
| `--color-info-content` on `--color-info` | 4.55:1 | AA |
| `--color-success-content` on `--color-success` | 5.78:1 | AA |
| `--color-warning-content` on `--color-warning` | 8.85:1 | AAA |
| `--color-error-content` on `--color-error` | 4.53:1 | AA |

6 of 11 text pairs reach AAA (7:1). Every pair reaches at least AA (4.5:1).

## Behaviour beyond the tokens

None. This theme changes only the token block above; every component rule below it is the one all themes share, so the same markup renders in any theme and only these values differ.

## Design notes (from the stylesheet header)

Verbatim from the top of the stylesheet. File names quoted in it may predate the `for-patients` / `for-practitioners` naming.

```text
Lily theme: vercel

Standalone Lily Design System theme — declares the theme tokens and inlines
the component CSS for all 492 Lily components, so this single file is the
only stylesheet required to render a Lily-styled page.

Credit for the theme source: Vercel (https://vercel.com/geist)

Upstream tracked: Vercel Geist (2026) light colours: black primary, grey scale, blue link, status colours.
========================================================================= */

Theme tokens — the colour, radius, border, and depth variables consumed
by every Lily component rule below. The theme applies by default (`:root`)
and also when explicitly opted into via `<html data-theme="light">`,
so multiple themes can coexist in one document and be switched at runtime
by updating the `data-theme` attribute. */
```

## Usage

```html
<link rel="stylesheet" href="/themes/vercel.css" data-lily-theme-picker>
<html data-theme="vercel">
```

`theme-picker` loads this stylesheet by swapping the managed `<link>`'s `href` and setting `data-theme="vercel"` on the document root; `picker-bar` lists it by default. Installed from npm: `@lilydesignsystem/themes/vercel.css`. The stylesheet is standalone: every Lily component rule is inlined, in `@layer lily` with zero-specificity `:where()` selectors, so application CSS always wins.

## Related

- [Themes index](../../index.md) — the package contract.
- [AGENTS/theme.md](../../../../AGENTS/theme.md) — token shape and the headless forbidden list.
- [spec/theme](../../../../spec/theme/index.md) — the theme topic.
- [spec/theme-picker](../../../../spec/theme-picker/index.md) — runtime switching.
