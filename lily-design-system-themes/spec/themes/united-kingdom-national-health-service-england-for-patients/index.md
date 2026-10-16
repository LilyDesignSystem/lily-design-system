# United Kingdom National Health Service England For Patients

NHS England (NHS.UK) for the public: NHS Blue primary, NHS Dark Blue secondary, warm-yellow focus, 4px radii, square selectors and flat surfaces. The stylesheet header cites NHS Blue as `#005EB8`; the token is `oklch(45% 0.17 251)`, which renders as `#0054ae`, a slightly darker blue. The reading experience of nhs.uk: 16px body text and generous hit targets. Token-only; the component rules are the shared ones.

## At a glance

| | |
| --- | --- |
| Slug / `data-theme` | `united-kingdom-national-health-service-england-for-patients` |
| Stylesheet | [`themes/united-kingdom-national-health-service-england-for-patients.css`](../../../../themes/united-kingdom-national-health-service-england-for-patients.css) |
| Token source | [`themes/tokens/united-kingdom-national-health-service-england-for-patients.json`](../../../../themes/tokens/united-kingdom-national-health-service-england-for-patients.json) |
| Colour scheme | `light` |
| Group | UK and US government (listed last in `picker-bar`) |
| Primary | `#0054ae` (blue) |
| Page surface | `#ffffff` |
| Body text on page surface | `#212a2f`, 14.6:1 |
| Text pairs at AAA (7:1) | 7 of 11 |
| Text pairs below AA (4.5:1) | 1 of 11 |

## Upstream

- **Tracks:** NHS.UK frontend v9.x visual language (v10 is in pre-release; re-check the palette when it goes stable). Independent implementation against Lily class hooks; not affiliated with or endorsed by the NHS.
- **Affiliation:** Independent implementation against Lily class hooks; not affiliated with or endorsed by the NHS or its bodies.

## Palette

| Token | Value | sRGB | Role |
| --- | --- | --- | --- |
| `--color-base-100` | `oklch(100% 0 0)` | `#ffffff` | page surface |
| `--color-base-200` | `oklch(94% 0.005 220)` | `#e8eced` | panels, cards, table headers |
| `--color-base-300` | `oklch(89% 0.007 220)` | `#d6dcde` | dividers, hover rows, borders |
| `--color-base-content` | `oklch(28% 0.015 230)` | `#212a2f` | body text |
| `--color-primary` | `oklch(45% 0.17 251)` | `#0054ae` | primary action, focus intent |
| `--color-primary-content` | `oklch(100% 0 0)` | `#ffffff` | text on primary |
| `--color-secondary` | `oklch(33% 0.18 264)` | `#02228f` | hover and secondary chrome |
| `--color-secondary-content` | `oklch(100% 0 0)` | `#ffffff` | text on secondary |
| `--color-accent` | `oklch(52% 0.13 220)` | `#00789c` | sparing emphasis |
| `--color-accent-content` | `oklch(100% 0 0)` | `#ffffff` | text on accent |
| `--color-neutral` | `oklch(28% 0.015 230)` | `#212a2f` | footer, code, tooltips |
| `--color-neutral-content` | `oklch(100% 0 0)` | `#ffffff` | text on neutral |
| `--color-info` | `oklch(54% 0.17 247)` | `#0072ca` | informational |
| `--color-info-content` | `oklch(100% 0 0)` | `#ffffff` | text on info |
| `--color-success` | `oklch(56% 0.16 145)` | `#218b30` | success, confirmation |
| `--color-success-content` | `oklch(100% 0 0)` | `#ffffff` | text on success |
| `--color-warning` | `oklch(82% 0.16 79)` | `#fbb62b` | warning, caution |
| `--color-warning-content` | `oklch(28% 0.015 230)` | `#212a2f` | text on warning |
| `--color-error` | `oklch(55% 0.22 28)` | `#d40e14` | error, destructive |
| `--color-error-content` | `oklch(100% 0 0)` | `#ffffff` | text on error |

## Shape and depth

| Token | Value | Applied to |
| --- | --- | --- |
| `--radius-selector` | `0rem` (0px) | chips, badges, switches, checkbox and radio containers |
| `--radius-field` | `0.25rem` (4px) | inputs, buttons, menu items, tooltips |
| `--radius-box` | `0.25rem` (4px) | cards, dialogs, drawers, hero blocks |
| `--border` | `1px` | stroke weight everywhere |
| `--depth` | `0` | flat: no shadows |
| `--noise` | `0` | no texture |

## Contrast

| Pair | Ratio | Level |
| --- | ---: | --- |
| `--color-base-content` on `--color-base-100` | 14.61:1 | AAA |
| `--color-base-content` on `--color-base-200` | 12.28:1 | AAA |
| `--color-base-content` on `--color-base-300` | 10.54:1 | AAA |
| `--color-primary-content` on `--color-primary` | 7.29:1 | AAA |
| `--color-secondary-content` on `--color-secondary` | 12.90:1 | AAA |
| `--color-accent-content` on `--color-accent` | 5.04:1 | AA |
| `--color-neutral-content` on `--color-neutral` | 14.61:1 | AAA |
| `--color-info-content` on `--color-info` | 4.93:1 | AA |
| `--color-success-content` on `--color-success` | 4.37:1 | AA large |
| `--color-warning-content` on `--color-warning` | 8.23:1 | AAA |
| `--color-error-content` on `--color-error` | 5.42:1 | AA |

7 of 11 text pairs reach AAA (7:1). Below AA (4.5:1): `--color-success-content` on `--color-success` 4.37:1. These are the theme author's colours; Lily never rewrites them, and `bin/check-theme --contrast` reports the same pairs.

## Behaviour beyond the tokens

None. This theme changes only the token block above; every component rule below it is the one all themes share, so the same markup renders in any theme and only these values differ.

## Design notes (from the stylesheet header)

Verbatim from the top of the stylesheet. File names quoted in it may predate the `for-patients` / `for-practitioners` naming.

```text
NHS England (United Kingdom) Design System
Upstream tracked: NHS.UK frontend v9.x visual language (v10 is in
pre-release; re-check the palette when it goes stable). Independent
implementation against Lily class hooks; not affiliated with or
endorsed by the NHS.

Canonical references
  - NHS Service Manual: https://service-manual.nhs.uk/design-system
  - NHS Identity Guidelines (Colours):
      https://www.england.nhs.uk/nhsidentity/identity-guidelines/colours/
  - NHS frontend tokens (Sass source):
      https://github.com/nhsuk/nhsuk-frontend
  - Typography: Frutiger W01 (primary), Arial / system-ui fallback
  - Base font size: 16px, modular scale (14 / 16 / 19 / 22 / 26 / 32 / 48 / 64)
  - Spacing scale (px): 0, 4, 8, 12, 16, 24, 32, 40, 48, 64
  - WCAG 2.2 AAA target; focus outline is 4px solid #FFEB3B over #212B32

Brand palette (sRGB → OKLCH conversions used below)
  NHS Blue           #005EB8   primary brand colour
  NHS Dark Blue      #003087   hover / pressed states, secondary
  NHS Bright Blue    #0072CE   informational links / chips
  NHS Light Blue     #41B6E6   accent, illustrative
  NHS Aqua Blue      #00A9CE   emphasis / supplementary
  NHS Black          #212B32   primary text
  NHS Dark Grey      #425563   secondary text
  NHS Mid Grey       #768692   tertiary text / borders
  NHS Pale Grey      #E8EDEE   surface backgrounds
  NHS White          #FFFFFF   page background
  NHS Warm Yellow    #FFB81C   warning / focus indicator
  NHS Emergency Red  #DA291C   error / destructive action
  NHS Green          #009639   success / confirmation
  NHS Dark Green     #006747   success hover

Geometry rules (NHS frontend defaults)
  - Border radius: 4px on cards / inputs / buttons (selectors are square: 0)
  - Borders: 1px solid, drawn in NHS Mid Grey #768692 by default
  - Surfaces are flat: no shadow, no gradient (depth = 0)
  - No textures / noise (noise = 0); the system favours legibility over flair

Accessibility commitments encoded in this theme
  - All foreground/background pairs target WCAG AA at minimum (most reach AAA)
  - Warning content is dark (oklch ~28%) so #FFB81C yellow stays legible
  - Primary/secondary/info/success/error all use white content for contrast
========================================================================= */

Theme tokens — the colour, radius, border, and depth variables consumed
by every Lily component rule below. The theme applies by default (`:root`)
and also when explicitly opted into via `<html data-theme="united-kingdom-national-health-service-england-for-patients">`,
so multiple themes can coexist in one document and be switched at runtime
by updating the `data-theme` attribute. */
```

## Usage

```html
<link rel="stylesheet" href="/themes/united-kingdom-national-health-service-england-for-patients.css" data-lily-theme-picker>
<html data-theme="united-kingdom-national-health-service-england-for-patients">
```

`theme-picker` loads this stylesheet by swapping the managed `<link>`'s `href` and setting `data-theme="united-kingdom-national-health-service-england-for-patients"` on the document root; `picker-bar` lists it by default. Installed from npm: `@lilydesignsystem/themes/united-kingdom-national-health-service-england-for-patients.css`. The stylesheet is standalone: every Lily component rule is inlined, in `@layer lily` with zero-specificity `:where()` selectors, so application CSS always wins.

## Related

- [Themes index](../../index.md) — the package contract.
- [AGENTS/theme.md](../../../../AGENTS/theme.md) — token shape and the headless forbidden list.
- [spec/theme](../../../../spec/theme/index.md) — the theme topic.
- [spec/theme-picker](../../../../spec/theme-picker/index.md) — runtime switching.
