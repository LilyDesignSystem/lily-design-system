# Ant Design

Ant Design 5 as a Lily theme: the blue primary (`#1677ff`, nudged darker for 4.5:1 text), purple secondary and cyan accent on white with Ant's layout grey (`#f5f5f5`) and border grey (`#d9d9d9`), 6px fields and 8px boxes. A familiar enterprise-dashboard look.

## At a glance

| | |
| --- | --- |
| Slug / `data-theme` | `ant-design` |
| Stylesheet | [`themes/ant-design.css`](../../../../themes/ant-design.css) |
| Token source | [`themes/tokens/ant-design.json`](../../../../themes/tokens/ant-design.json) |
| Colour scheme | `light` |
| Group | Design-system reference |
| Primary | `#066ff6` (blue) |
| Page surface | `#ffffff` |
| Body text on page surface | `#1f1f1f`, 16.5:1 |
| Text pairs at AAA (7:1) | 7 of 11 |
| Text pairs below AA (4.5:1) | 0 of 11 |

## Upstream

- **Source:** Ant Design (https://ant.design/)
- **Tracks:** Ant Design 5.x (2026) default theme tokens: colorPrimary, status colours, layout greys.
- **Affiliation:** Independent implementation of public design tokens against Lily class hooks; not affiliated with or endorsed by the owner of the design system or its trademarks.

## Palette

| Token | Value | sRGB | Role |
| --- | --- | --- | --- |
| `--color-base-100` | `#ffffff` | `#ffffff` | page surface |
| `--color-base-200` | `#f5f5f5` | `#f5f5f5` | panels, cards, table headers |
| `--color-base-300` | `#d9d9d9` | `#d9d9d9` | dividers, hover rows, borders |
| `--color-base-content` | `#1f1f1f` | `#1f1f1f` | body text |
| `--color-primary` | `#066ff6` | `#066ff6` | primary action, focus intent |
| `--color-primary-content` | `#ffffff` | `#ffffff` | text on primary |
| `--color-secondary` | `#722ed1` | `#722ed1` | hover and secondary chrome |
| `--color-secondary-content` | `#ffffff` | `#ffffff` | text on secondary |
| `--color-accent` | `#13c2c2` | `#13c2c2` | sparing emphasis |
| `--color-accent-content` | `#1f1f1f` | `#1f1f1f` | text on accent |
| `--color-neutral` | `#001529` | `#001529` | footer, code, tooltips |
| `--color-neutral-content` | `#ffffff` | `#ffffff` | text on neutral |
| `--color-info` | `#066ff6` | `#066ff6` | informational |
| `--color-info-content` | `#ffffff` | `#ffffff` | text on info |
| `--color-success` | `#52c41a` | `#52c41a` | success, confirmation |
| `--color-success-content` | `#1f1f1f` | `#1f1f1f` | text on success |
| `--color-warning` | `#faad14` | `#faad14` | warning, caution |
| `--color-warning-content` | `#1f1f1f` | `#1f1f1f` | text on warning |
| `--color-error` | `#ff4d4f` | `#ff4d4f` | error, destructive |
| `--color-error-content` | `#1f1f1f` | `#1f1f1f` | text on error |

## Shape and depth

| Token | Value | Applied to |
| --- | --- | --- |
| `--radius-selector` | `0.25rem` (4px) | chips, badges, switches, checkbox and radio containers |
| `--radius-field` | `0.375rem` (6px) | inputs, buttons, menu items, tooltips |
| `--radius-box` | `0.5rem` (8px) | cards, dialogs, drawers, hero blocks |
| `--border` | `1px` | stroke weight everywhere |
| `--depth` | `1` | shadows on |
| `--noise` | `0` | no texture |

## Contrast

| Pair | Ratio | Level |
| --- | ---: | --- |
| `--color-base-content` on `--color-base-100` | 16.48:1 | AAA |
| `--color-base-content` on `--color-base-200` | 15.12:1 | AAA |
| `--color-base-content` on `--color-base-300` | 11.68:1 | AAA |
| `--color-primary-content` on `--color-primary` | 4.55:1 | AA |
| `--color-secondary-content` on `--color-secondary` | 6.94:1 | AA |
| `--color-accent-content` on `--color-accent` | 7.47:1 | AAA |
| `--color-neutral-content` on `--color-neutral` | 18.43:1 | AAA |
| `--color-info-content` on `--color-info` | 4.55:1 | AA |
| `--color-success-content` on `--color-success` | 7.28:1 | AAA |
| `--color-warning-content` on `--color-warning` | 8.68:1 | AAA |
| `--color-error-content` on `--color-error` | 5.04:1 | AA |

7 of 11 text pairs reach AAA (7:1). Every pair reaches at least AA (4.5:1).

## Adjustments to the source colours

- `primary`: source `#1677ff` could not carry `#ffffff` text at 4.5:1, so it is moved along lightness (hue and chroma kept) to `#066ff6` (4.55:1).
- `info`: source `#1677ff` could not carry `#ffffff` text at 4.5:1, so it is moved along lightness (hue and chroma kept) to `#066ff6` (4.55:1).

## Behaviour beyond the tokens

None. This theme changes only the token block above; every component rule below it is the one all themes share, so the same markup renders in any theme and only these values differ.

## Design notes (from the stylesheet header)

Verbatim from the top of the stylesheet. File names quoted in it may predate the `for-patients` / `for-practitioners` naming.

```text
Lily theme: ant-design

Standalone Lily Design System theme — declares the theme tokens and inlines
the component CSS for all 492 Lily components, so this single file is the
only stylesheet required to render a Lily-styled page.

Credit for the theme source: Ant Design (https://ant.design/)

Upstream tracked: Ant Design 5.x (2026) default theme tokens: colorPrimary, status colours, layout greys.
========================================================================= */

Theme tokens — the colour, radius, border, and depth variables consumed
by every Lily component rule below. The theme applies by default (`:root`)
and also when explicitly opted into via `<html data-theme="light">`,
so multiple themes can coexist in one document and be switched at runtime
by updating the `data-theme` attribute. */
```

## Usage

```html
<link rel="stylesheet" href="/themes/ant-design.css" data-lily-theme-picker>
<html data-theme="ant-design">
```

`theme-picker` loads this stylesheet by swapping the managed `<link>`'s `href` and setting `data-theme="ant-design"` on the document root; `picker-bar` lists it by default. Installed from npm: `@lilydesignsystem/themes/ant-design.css`. The stylesheet is standalone: every Lily component rule is inlined, in `@layer lily` with zero-specificity `:where()` selectors, so application CSS always wins.

## Related

- [Themes index](../../index.md) — the package contract.
- [AGENTS/theme.md](../../../../AGENTS/theme.md) — token shape and the headless forbidden list.
- [spec/theme](../../../../spec/theme/index.md) — the theme topic.
- [spec/theme-picker](../../../../spec/theme-picker/index.md) — runtime switching.
