# Notion

Notion web app light theme as a Lily theme: warm near-black ink (`#37352f`) on white, the sidebar surface `#f7f6f3` and border `#e9e9e7`, Notion blue primary (darkened to pass 4.5:1), purple secondary and a pink accent. 4px radii, flat.

## At a glance

| | |
| --- | --- |
| Slug / `data-theme` | `notion` |
| Stylesheet | [`themes/notion.css`](../../../../themes/notion.css) |
| Token source | [`themes/tokens/notion.json`](../../../../themes/tokens/notion.json) |
| Colour scheme | `light` |
| Group | Design-system reference |
| Primary | `#0e76d4` (blue) |
| Page surface | `#ffffff` |
| Body text on page surface | `#37352f`, 12.3:1 |
| Text pairs at AAA (7:1) | 5 of 11 |
| Text pairs below AA (4.5:1) | 0 of 11 |

## Upstream

- **Source:** Notion (https://www.notion.so/)
- **Tracks:** Notion web app (2026) light theme: warm greys, near-black ink, Notion colour set.
- **Affiliation:** Independent implementation of public design tokens against Lily class hooks; not affiliated with or endorsed by the owner of the design system or its trademarks.

## Palette

| Token | Value | sRGB | Role |
| --- | --- | --- | --- |
| `--color-base-100` | `#ffffff` | `#ffffff` | page surface |
| `--color-base-200` | `#f7f6f3` | `#f7f6f3` | panels, cards, table headers |
| `--color-base-300` | `#e9e9e7` | `#e9e9e7` | dividers, hover rows, borders |
| `--color-base-content` | `#37352f` | `#37352f` | body text |
| `--color-primary` | `#0e76d4` | `#0e76d4` | primary action, focus intent |
| `--color-primary-content` | `#ffffff` | `#ffffff` | text on primary |
| `--color-secondary` | `#6940a5` | `#6940a5` | hover and secondary chrome |
| `--color-secondary-content` | `#ffffff` | `#ffffff` | text on secondary |
| `--color-accent` | `#ad1a72` | `#ad1a72` | sparing emphasis |
| `--color-accent-content` | `#ffffff` | `#ffffff` | text on accent |
| `--color-neutral` | `#37352f` | `#37352f` | footer, code, tooltips |
| `--color-neutral-content` | `#ffffff` | `#ffffff` | text on neutral |
| `--color-info` | `#0b6e99` | `#0b6e99` | informational |
| `--color-info-content` | `#ffffff` | `#ffffff` | text on info |
| `--color-success` | `#0f7b6c` | `#0f7b6c` | success, confirmation |
| `--color-success-content` | `#ffffff` | `#ffffff` | text on success |
| `--color-warning` | `#dfab01` | `#dfab01` | warning, caution |
| `--color-warning-content` | `#37352f` | `#37352f` | text on warning |
| `--color-error` | `#db3839` | `#db3839` | error, destructive |
| `--color-error-content` | `#ffffff` | `#ffffff` | text on error |

## Shape and depth

| Token | Value | Applied to |
| --- | --- | --- |
| `--radius-selector` | `0.25rem` (4px) | chips, badges, switches, checkbox and radio containers |
| `--radius-field` | `0.25rem` (4px) | inputs, buttons, menu items, tooltips |
| `--radius-box` | `0.25rem` (4px) | cards, dialogs, drawers, hero blocks |
| `--border` | `1px` | stroke weight everywhere |
| `--depth` | `0` | flat: no shadows |
| `--noise` | `0` | no texture |

## Contrast

| Pair | Ratio | Level |
| --- | ---: | --- |
| `--color-base-content` on `--color-base-100` | 12.26:1 | AAA |
| `--color-base-content` on `--color-base-200` | 11.35:1 | AAA |
| `--color-base-content` on `--color-base-300` | 10.09:1 | AAA |
| `--color-primary-content` on `--color-primary` | 4.60:1 | AA |
| `--color-secondary-content` on `--color-secondary` | 7.30:1 | AAA |
| `--color-accent-content` on `--color-accent` | 6.63:1 | AA |
| `--color-neutral-content` on `--color-neutral` | 12.26:1 | AAA |
| `--color-info-content` on `--color-info` | 5.67:1 | AA |
| `--color-success-content` on `--color-success` | 5.16:1 | AA |
| `--color-warning-content` on `--color-warning` | 5.82:1 | AA |
| `--color-error-content` on `--color-error` | 4.53:1 | AA |

5 of 11 text pairs reach AAA (7:1). Every pair reaches at least AA (4.5:1).

## Adjustments to the source colours

- `primary`: source `#2383e2` could not carry `#ffffff` text at 4.5:1, so it is moved along lightness (hue and chroma kept) to `#0e76d4` (4.6:1).
- `error`: source `#e03e3e` could not carry `#ffffff` text at 4.5:1, so it is moved along lightness (hue and chroma kept) to `#db3839` (4.53:1).

## Behaviour beyond the tokens

None. This theme changes only the token block above; every component rule below it is the one all themes share, so the same markup renders in any theme and only these values differ.

## Design notes (from the stylesheet header)

Verbatim from the top of the stylesheet. File names quoted in it may predate the `for-patients` / `for-practitioners` naming.

```text
Lily theme: notion

Standalone Lily Design System theme — declares the theme tokens and inlines
the component CSS for all 492 Lily components, so this single file is the
only stylesheet required to render a Lily-styled page.

Credit for the theme source: Notion (https://www.notion.so/)

Upstream tracked: Notion web app (2026) light theme: warm greys, near-black ink, Notion colour set.
========================================================================= */

Theme tokens — the colour, radius, border, and depth variables consumed
by every Lily component rule below. The theme applies by default (`:root`)
and also when explicitly opted into via `<html data-theme="light">`,
so multiple themes can coexist in one document and be switched at runtime
by updating the `data-theme` attribute. */
```

## Usage

```html
<link rel="stylesheet" href="/themes/notion.css" data-lily-theme-picker>
<html data-theme="notion">
```

`theme-picker` loads this stylesheet by swapping the managed `<link>`'s `href` and setting `data-theme="notion"` on the document root; `picker-bar` lists it by default. Installed from npm: `@lilydesignsystem/themes/notion.css`. The stylesheet is standalone: every Lily component rule is inlined, in `@layer lily` with zero-specificity `:where()` selectors, so application CSS always wins.

## Related

- [Themes index](../../index.md) — the package contract.
- [AGENTS/theme.md](../../../../AGENTS/theme.md) — token shape and the headless forbidden list.
- [spec/theme](../../../../spec/theme/index.md) — the theme topic.
- [spec/theme-picker](../../../../spec/theme-picker/index.md) — runtime switching.
