# Atlassian

Atlassian Design System as a Lily theme: brand blue (`#0c66e4`), discovery purple, teal accent and the near-black text (`#292a2e`) on white and the sunken `#f7f8f9` surface, with Atlassian's tight 3px radii and no shadows.

## At a glance

| | |
| --- | --- |
| Slug / `data-theme` | `atlassian` |
| Stylesheet | [`themes/atlassian.css`](../../../../themes/atlassian.css) |
| Token source | [`themes/tokens/atlassian.json`](../../../../themes/tokens/atlassian.json) |
| Colour scheme | `light` |
| Group | Design-system reference |
| Primary | `#0c66e4` (blue) |
| Page surface | `#ffffff` |
| Body text on page surface | `#292a2e`, 14.3:1 |
| Text pairs at AAA (7:1) | 5 of 11 |
| Text pairs below AA (4.5:1) | 0 of 11 |

## Upstream

- **Source:** Atlassian (https://atlassian.design/)
- **Tracks:** Atlassian Design System (2026) colour tokens: brand, status and neutral surfaces.
- **Affiliation:** Independent implementation of public design tokens against Lily class hooks; not affiliated with or endorsed by the owner of the design system or its trademarks.

## Palette

| Token | Value | sRGB | Role |
| --- | --- | --- | --- |
| `--color-base-100` | `#ffffff` | `#ffffff` | page surface |
| `--color-base-200` | `#f7f8f9` | `#f7f8f9` | panels, cards, table headers |
| `--color-base-300` | `#dcdfe4` | `#dcdfe4` | dividers, hover rows, borders |
| `--color-base-content` | `#292a2e` | `#292a2e` | body text |
| `--color-primary` | `#0c66e4` | `#0c66e4` | primary action, focus intent |
| `--color-primary-content` | `#ffffff` | `#ffffff` | text on primary |
| `--color-secondary` | `#6e5dc6` | `#6e5dc6` | hover and secondary chrome |
| `--color-secondary-content` | `#ffffff` | `#ffffff` | text on secondary |
| `--color-accent` | `#2f9dc2` | `#2f9dc2` | sparing emphasis |
| `--color-accent-content` | `#292a2e` | `#292a2e` | text on accent |
| `--color-neutral` | `#172b4d` | `#172b4d` | footer, code, tooltips |
| `--color-neutral-content` | `#ffffff` | `#ffffff` | text on neutral |
| `--color-info` | `#0c66e4` | `#0c66e4` | informational |
| `--color-info-content` | `#ffffff` | `#ffffff` | text on info |
| `--color-success` | `#1f845a` | `#1f845a` | success, confirmation |
| `--color-success-content` | `#ffffff` | `#ffffff` | text on success |
| `--color-warning` | `#f5cd47` | `#f5cd47` | warning, caution |
| `--color-warning-content` | `#292a2e` | `#292a2e` | text on warning |
| `--color-error` | `#c9372c` | `#c9372c` | error, destructive |
| `--color-error-content` | `#ffffff` | `#ffffff` | text on error |

## Shape and depth

| Token | Value | Applied to |
| --- | --- | --- |
| `--radius-selector` | `0.1875rem` (3px) | chips, badges, switches, checkbox and radio containers |
| `--radius-field` | `0.1875rem` (3px) | inputs, buttons, menu items, tooltips |
| `--radius-box` | `0.375rem` (6px) | cards, dialogs, drawers, hero blocks |
| `--border` | `1px` | stroke weight everywhere |
| `--depth` | `0` | flat: no shadows |
| `--noise` | `0` | no texture |

## Contrast

| Pair | Ratio | Level |
| --- | ---: | --- |
| `--color-base-content` on `--color-base-100` | 14.34:1 | AAA |
| `--color-base-content` on `--color-base-200` | 13.48:1 | AAA |
| `--color-base-content` on `--color-base-300` | 10.73:1 | AAA |
| `--color-primary-content` on `--color-primary` | 5.20:1 | AA |
| `--color-secondary-content` on `--color-secondary` | 5.19:1 | AA |
| `--color-accent-content` on `--color-accent` | 4.59:1 | AA |
| `--color-neutral-content` on `--color-neutral` | 14.10:1 | AAA |
| `--color-info-content` on `--color-info` | 5.20:1 | AA |
| `--color-success-content` on `--color-success` | 4.66:1 | AA |
| `--color-warning-content` on `--color-warning` | 9.36:1 | AAA |
| `--color-error-content` on `--color-error` | 5.16:1 | AA |

5 of 11 text pairs reach AAA (7:1). Every pair reaches at least AA (4.5:1).

## Adjustments to the source colours

- `accent`: source `#2898bd` could not carry `#292a2e` text at 4.5:1, so it is moved along lightness (hue and chroma kept) to `#2f9dc2` (4.59:1).

## Behaviour beyond the tokens

None. This theme changes only the token block above; every component rule below it is the one all themes share, so the same markup renders in any theme and only these values differ.

## Design notes (from the stylesheet header)

Verbatim from the top of the stylesheet. File names quoted in it may predate the `for-patients` / `for-practitioners` naming.

```text
Lily theme: atlassian

Standalone Lily Design System theme — declares the theme tokens and inlines
the component CSS for all 492 Lily components, so this single file is the
only stylesheet required to render a Lily-styled page.

Credit for the theme source: Atlassian (https://atlassian.design/)

Upstream tracked: Atlassian Design System (2026) colour tokens: brand, status and neutral surfaces.
========================================================================= */

Theme tokens — the colour, radius, border, and depth variables consumed
by every Lily component rule below. The theme applies by default (`:root`)
and also when explicitly opted into via `<html data-theme="light">`,
so multiple themes can coexist in one document and be switched at runtime
by updating the `data-theme` attribute. */
```

## Usage

```html
<link rel="stylesheet" href="/themes/atlassian.css" data-lily-theme-picker>
<html data-theme="atlassian">
```

`theme-picker` loads this stylesheet by swapping the managed `<link>`'s `href` and setting `data-theme="atlassian"` on the document root; `picker-bar` lists it by default. Installed from npm: `@lilydesignsystem/themes/atlassian.css`. The stylesheet is standalone: every Lily component rule is inlined, in `@layer lily` with zero-specificity `:where()` selectors, so application CSS always wins.

## Related

- [Themes index](../../index.md) — the package contract.
- [AGENTS/theme.md](../../../../AGENTS/theme.md) — token shape and the headless forbidden list.
- [spec/theme](../../../../spec/theme/index.md) — the theme topic.
- [spec/theme-picker](../../../../spec/theme-picker/index.md) — runtime switching.
