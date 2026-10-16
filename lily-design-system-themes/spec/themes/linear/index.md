# Linear

A dark theme after the Linear app: near-black surfaces (`#0f1011`, `#1a1b1e`), light text (`#f7f8f8`), an indigo primary (`#5e6ad2`, nudged for 4.5:1), a periwinkle secondary and a cyan accent, with quiet 1px borders, 4–8px radii and no shadows. The only dark theme among the design-system references.

## At a glance

| | |
| --- | --- |
| Slug / `data-theme` | `linear` |
| Stylesheet | [`themes/linear.css`](../../../../themes/linear.css) |
| Token source | [`themes/tokens/linear.json`](../../../../themes/tokens/linear.json) |
| Colour scheme | `dark` |
| Group | Design-system reference |
| Primary | `#5d68d0` (violet) |
| Page surface | `#0f1011` |
| Body text on page surface | `#f7f8f8`, 17.9:1 |
| Text pairs at AAA (7:1) | 8 of 11 |
| Text pairs below AA (4.5:1) | 0 of 11 |

## Upstream

- **Source:** Linear (https://linear.app/)
- **Tracks:** Linear web app (2026) dark theme: near-black surfaces, indigo brand, quiet borders.
- **Affiliation:** Independent implementation of public design tokens against Lily class hooks; not affiliated with or endorsed by the owner of the design system or its trademarks.

## Palette

| Token | Value | sRGB | Role |
| --- | --- | --- | --- |
| `--color-base-100` | `#0f1011` | `#0f1011` | page surface |
| `--color-base-200` | `#1a1b1e` | `#1a1b1e` | panels, cards, table headers |
| `--color-base-300` | `#2a2b30` | `#2a2b30` | dividers, hover rows, borders |
| `--color-base-content` | `#f7f8f8` | `#f7f8f8` | body text |
| `--color-primary` | `#5d68d0` | `#5d68d0` | primary action, focus intent |
| `--color-primary-content` | `#f7f8f8` | `#f7f8f8` | text on primary |
| `--color-secondary` | `#828fff` | `#828fff` | hover and secondary chrome |
| `--color-secondary-content` | `#0f1011` | `#0f1011` | text on secondary |
| `--color-accent` | `#26b5ce` | `#26b5ce` | sparing emphasis |
| `--color-accent-content` | `#0f1011` | `#0f1011` | text on accent |
| `--color-neutral` | `#08090a` | `#08090a` | footer, code, tooltips |
| `--color-neutral-content` | `#f7f8f8` | `#f7f8f8` | text on neutral |
| `--color-info` | `#4ea7fc` | `#4ea7fc` | informational |
| `--color-info-content` | `#0f1011` | `#0f1011` | text on info |
| `--color-success` | `#4cb782` | `#4cb782` | success, confirmation |
| `--color-success-content` | `#0f1011` | `#0f1011` | text on success |
| `--color-warning` | `#f2994a` | `#f2994a` | warning, caution |
| `--color-warning-content` | `#0f1011` | `#0f1011` | text on warning |
| `--color-error` | `#eb5757` | `#eb5757` | error, destructive |
| `--color-error-content` | `#0f1011` | `#0f1011` | text on error |

## Shape and depth

| Token | Value | Applied to |
| --- | --- | --- |
| `--radius-selector` | `0.25rem` (4px) | chips, badges, switches, checkbox and radio containers |
| `--radius-field` | `0.375rem` (6px) | inputs, buttons, menu items, tooltips |
| `--radius-box` | `0.5rem` (8px) | cards, dialogs, drawers, hero blocks |
| `--border` | `1px` | stroke weight everywhere |
| `--depth` | `0` | flat: no shadows |
| `--noise` | `0` | no texture |

## Contrast

| Pair | Ratio | Level |
| --- | ---: | --- |
| `--color-base-content` on `--color-base-100` | 17.90:1 | AAA |
| `--color-base-content` on `--color-base-200` | 16.19:1 | AAA |
| `--color-base-content` on `--color-base-300` | 13.28:1 | AAA |
| `--color-primary-content` on `--color-primary` | 4.53:1 | AA |
| `--color-secondary-content` on `--color-secondary` | 6.64:1 | AA |
| `--color-accent-content` on `--color-accent` | 7.79:1 | AAA |
| `--color-neutral-content` on `--color-neutral` | 18.73:1 | AAA |
| `--color-info-content` on `--color-info` | 7.49:1 | AAA |
| `--color-success-content` on `--color-success` | 7.62:1 | AAA |
| `--color-warning-content` on `--color-warning` | 8.55:1 | AAA |
| `--color-error-content` on `--color-error` | 5.47:1 | AA |

8 of 11 text pairs reach AAA (7:1). Every pair reaches at least AA (4.5:1).

## Adjustments to the source colours

- `primary`: source `#5e6ad2` could not carry `#f7f8f8` text at 4.5:1, so it is moved along lightness (hue and chroma kept) to `#5d68d0` (4.53:1).

## Behaviour beyond the tokens

None. This theme changes only the token block above; every component rule below it is the one all themes share, so the same markup renders in any theme and only these values differ.

## Design notes (from the stylesheet header)

Verbatim from the top of the stylesheet. File names quoted in it may predate the `for-patients` / `for-practitioners` naming.

```text
Lily theme: linear

Standalone Lily Design System theme — declares the theme tokens and inlines
the component CSS for all 492 Lily components, so this single file is the
only stylesheet required to render a Lily-styled page.

Credit for the theme source: Linear (https://linear.app/)

Upstream tracked: Linear web app (2026) dark theme: near-black surfaces, indigo brand, quiet borders.
========================================================================= */

Theme tokens — the colour, radius, border, and depth variables consumed
by every Lily component rule below. The theme applies by default (`:root`)
and also when explicitly opted into via `<html data-theme="light">`,
so multiple themes can coexist in one document and be switched at runtime
by updating the `data-theme` attribute. */
```

## Usage

```html
<link rel="stylesheet" href="/themes/linear.css" data-lily-theme-picker>
<html data-theme="linear">
```

`theme-picker` loads this stylesheet by swapping the managed `<link>`'s `href` and setting `data-theme="linear"` on the document root; `picker-bar` lists it by default. Installed from npm: `@lilydesignsystem/themes/linear.css`. The stylesheet is standalone: every Lily component rule is inlined, in `@layer lily` with zero-specificity `:where()` selectors, so application CSS always wins.

## Related

- [Themes index](../../index.md) — the package contract.
- [AGENTS/theme.md](../../../../AGENTS/theme.md) — token shape and the headless forbidden list.
- [spec/theme](../../../../spec/theme/index.md) — the theme topic.
- [spec/theme-picker](../../../../spec/theme-picker/index.md) — runtime switching.
