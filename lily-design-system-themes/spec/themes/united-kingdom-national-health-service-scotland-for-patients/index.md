# United Kingdom National Health Service Scotland For Patients

NHS Scotland for the public: the formal NHS Scotland navy as primary (the header cites Navy `#003087`, Pantone 287; the token is `oklch(32% 0.18 264)`, which renders `#011e8c`) with a mid-blue (`#006ac9`) secondary and a teal accent, harmonising the NHS Scotland corporate brand, NHS Inform and NHS 24 into one token set. 4px radii, square selectors, flat. Token-only.

## At a glance

| | |
| --- | --- |
| Slug / `data-theme` | `united-kingdom-national-health-service-scotland-for-patients` |
| Stylesheet | [`themes/united-kingdom-national-health-service-scotland-for-patients.css`](../../../../themes/united-kingdom-national-health-service-scotland-for-patients.css) |
| Token source | [`themes/tokens/united-kingdom-national-health-service-scotland-for-patients.json`](../../../../themes/tokens/united-kingdom-national-health-service-scotland-for-patients.json) |
| Colour scheme | `light` |
| Group | UK and US government (listed last in `picker-bar`) |
| Primary | `#011e8c` (blue) |
| Page surface | `#ffffff` |
| Body text on page surface | `#1d252a`, 15.6:1 |
| Text pairs at AAA (7:1) | 6 of 11 |
| Text pairs below AA (4.5:1) | 1 of 11 |

## Upstream

- **Tracks:** NHS.UK frontend v9.x visual language (v10 is in pre-release; re-check the palette when it goes stable). Independent implementation against Lily class hooks; not affiliated with or endorsed by the NHS.
- **Affiliation:** Independent implementation against Lily class hooks; not affiliated with or endorsed by the NHS or its bodies.

## Palette

| Token | Value | sRGB | Role |
| --- | --- | --- | --- |
| `--color-base-100` | `oklch(100% 0 0)` | `#ffffff` | page surface |
| `--color-base-200` | `oklch(96% 0.008 220)` | `#ecf3f5` | panels, cards, table headers |
| `--color-base-300` | `oklch(92% 0.01 220)` | `#dee6e9` | dividers, hover rows, borders |
| `--color-base-content` | `oklch(26% 0.015 230)` | `#1d252a` | body text |
| `--color-primary` | `oklch(32% 0.18 264)` | `#011e8c` | primary action, focus intent |
| `--color-primary-content` | `oklch(100% 0 0)` | `#ffffff` | text on primary |
| `--color-secondary` | `oklch(52% 0.18 248)` | `#006ac9` | hover and secondary chrome |
| `--color-secondary-content` | `oklch(100% 0 0)` | `#ffffff` | text on secondary |
| `--color-accent` | `oklch(52% 0.11 192)` | `#007c79` | sparing emphasis |
| `--color-accent-content` | `oklch(100% 0 0)` | `#ffffff` | text on accent |
| `--color-neutral` | `oklch(26% 0.015 230)` | `#1d252a` | footer, code, tooltips |
| `--color-neutral-content` | `oklch(100% 0 0)` | `#ffffff` | text on neutral |
| `--color-info` | `oklch(54% 0.17 247)` | `#0072ca` | informational |
| `--color-info-content` | `oklch(100% 0 0)` | `#ffffff` | text on info |
| `--color-success` | `oklch(56% 0.16 145)` | `#218b30` | success, confirmation |
| `--color-success-content` | `oklch(100% 0 0)` | `#ffffff` | text on success |
| `--color-warning` | `oklch(82% 0.16 79)` | `#fbb62b` | warning, caution |
| `--color-warning-content` | `oklch(26% 0.015 230)` | `#1d252a` | text on warning |
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
| `--color-base-content` on `--color-base-100` | 15.55:1 | AAA |
| `--color-base-content` on `--color-base-200` | 13.85:1 | AAA |
| `--color-base-content` on `--color-base-300` | 12.29:1 | AAA |
| `--color-primary-content` on `--color-primary` | 13.41:1 | AAA |
| `--color-secondary-content` on `--color-secondary` | 5.38:1 | AA |
| `--color-accent-content` on `--color-accent` | 5.05:1 | AA |
| `--color-neutral-content` on `--color-neutral` | 15.55:1 | AAA |
| `--color-info-content` on `--color-info` | 4.93:1 | AA |
| `--color-success-content` on `--color-success` | 4.37:1 | AA large |
| `--color-warning-content` on `--color-warning` | 8.76:1 | AAA |
| `--color-error-content` on `--color-error` | 5.42:1 | AA |

6 of 11 text pairs reach AAA (7:1). Below AA (4.5:1): `--color-success-content` on `--color-success` 4.37:1. These are the theme author's colours; Lily never rewrites them, and `bin/check-theme --contrast` reports the same pairs.

## Behaviour beyond the tokens

None. This theme changes only the token block above; every component rule below it is the one all themes share, so the same markup renders in any theme and only these values differ.

## Design notes (from the stylesheet header)

Verbatim from the top of the stylesheet. File names quoted in it may predate the `for-patients` / `for-practitioners` naming.

```text
NHS Scotland (United Kingdom) Design System
NHS Scotland is the umbrella for 14 territorial NHS boards plus seven
special boards (NHS 24, NHS Education for Scotland, NHS National Services
Scotland, Public Health Scotland, Scottish Ambulance Service, State
Hospitals Board, NHS Healthcare Improvement Scotland). Its public-facing
digital surface is split across three closely-aligned brand expressions
that this theme harmonises into one Lily token set:

  1. NHS Scotland corporate brand (Scottish Government / CMO directorate)
     — the formal navy-blue identity used by NHS boards, statutory
     publications, and the NHS Scotland staff intranet.
  2. NHS Inform — the citizen-facing health information service published
     by NHS 24 at nhsinform.scot. Uses the deeper navy plus a bright NHS
     cyan for links and signposting.
  3. NHS 24 service brand (111, Scotland's telehealth line) — a darker,
     more clinical reading of the same palette with magenta/violet
     callouts reserved for safety messaging.

Upstream tracked: NHS.UK frontend v9.x visual language (v10 is in
pre-release; re-check the palette when it goes stable). Independent
implementation against Lily class hooks; not affiliated with or
endorsed by the NHS.

Canonical references
  - NHS Scotland Identity Standards (Scottish Government CMO Directorate):
      https://www.publications.scot.nhs.uk/
  - NHS Inform (citizen-facing health information):
      https://www.nhsinform.scot/
  - NHS 24 (telehealth / 111):
      https://www.nhs24.scot/
  - Scottish Government Design System (sibling system, shares typography
    conventions and accessibility targets):
      https://designsystem.gov.scot/
  - Digital Scotland Service Standard (legal accessibility baseline):
      https://www.gov.scot/publications/digital-scotland-service-standard/
  - Typography: Frutiger W01 (primary, shared with NHS UK), Roboto for
    NHS Inform body copy, Arial / system-ui as the universal fallback.
  - Base font size: 16px; modular scale matches NHS UK (14/16/19/22/26/
    32/48/64) so components ported from the NHS UK frontend "just work".
  - Spacing scale (px): 0, 4, 8, 12, 16, 24, 32, 40, 48, 64 — identical
    to NHS UK frontend's `$nhsuk-spacing-responsive-scale`.
  - WCAG 2.2 AA mandated by the Digital Scotland Service Standard;
    Lily targets AAA. The focus indicator below clears AAA at 3:1
    against every surface in the theme.

Brand palette (sRGB swatches → OKLCH equivalents used in the theme)
  NHS Scotland Navy      #003087   primary brand colour (Pantone 287)
                                   The flagship NHS Scotland blue.
                                   Darker than NHS England's #005EB8;
                                   this is the single most distinctive
                                   visual difference between the two
                                   nations' systems.
  NHS Scotland Mid Blue  #0078D4   primary action / link colour
                                   (NHS Inform's link blue, also used
                                   on NHS24 service buttons).
  NHS Bright Blue        #0072CE   informational accents, shared with
                                   the NHS UK identity for cross-border
                                   services and chips/badges.
  NHS Light Blue         #41B6E6   illustrative accent, infographics,
                                   chart palette.
  NHS Aqua / Teal        #00A499   supplementary accent (NHS24 chrome).
  NHS Scotland Magenta   #AE2573   safety-critical callouts used by
                                   NHS 24 for "phone 999" messaging.
                                   Not exposed as a Lily role; cited
                                   here for completeness only.
  NHS Black              #212B32   primary text on white surfaces.
  NHS Dark Grey          #425563   secondary text, captions.
  NHS Mid Grey           #768692   tertiary text, dividers, default
                                   border colour on form fields.
  NHS Pale Grey          #E8EDEE   sectioned surfaces, summary panels,
                                   table zebra striping.
  NHS Inform Off-White   #F0F4F5   page wash used by nhsinform.scot
                                   behind the main column on wider
                                   viewports (slightly cooler than
                                   NHS UK's pale grey).
  NHS White              #FFFFFF   default page background.
  NHS Warm Yellow        #FFB81C   warning banners, also the canonical
                                   focus indicator across NHS UK / NHS
                                   Scotland / NHS Wales — a deliberate
                                   cross-system commitment so keyboard
                                   users recognise focus everywhere.
  NHS Emergency Red      #DA291C   error / destructive action, also
                                   the colour used on the "999" badge
                                   inside NHS Inform.
  NHS Green              #009639   success / confirmation.
  NHS Dark Green         #006747   success hover / pressed state.

Geometry rules (shared with NHS UK frontend)
  - Border radius: 4px on cards, inputs, and buttons. Selectors
    (checkbox/radio) are square (0px) to keep the tick mark perfectly
    centred — a NHS frontend convention preserved here.
  - Borders: 1px solid hairline, drawn in NHS Mid Grey #768692.
  - Surfaces are flat: no shadow, no gradient (depth = 0). NHS Scotland
    identity guidance discourages skeuomorphism so clinical content
    reads calmly on low-contrast and reduced-vision displays.
  - No textures or noise (noise = 0).

Accessibility commitments encoded in this theme
  - All foreground/background pairs target WCAG AA at minimum; the
    primary / secondary / info / success / error swatches reach AAA
    when paired with the matching *-content colour below.
  - Warning content is dark (≈ NHS Black) so #FFB81C yellow stays
    legible — yellow-on-white would fall below AA.
  - Focus ring (rendered by the example apps' CSS, not declared here)
    uses NHS Warm Yellow #FFB81C over NHS Black #212B32 to guarantee
    visibility on every theme surface including primary and error.
  - Colour is never the sole carrier of meaning (WCAG 1.4.1) — every
    status component pairs colour with an icon, text label, or ARIA
    attribute per AGENTS/accessibility.md.

Relationship to sibling themes
  - united-kingdom-national-health-service-england.css — same modular
    scale and geometry; primary is lighter (#005EB8 vs #003087).
  - united-kingdom-national-health-service-wales.css — shares yellow,
    red, and green roles; primary leans toward GIG Cymru's deeper navy.
  Components are visually portable across the three nations: only the
  primary / secondary / accent tokens differ, never the geometry or
  the safety palette (warning / error / success).
========================================================================= */

Theme tokens — the colour, radius, border, and depth variables consumed
by every Lily component rule below. The theme applies by default (`:root`)
and also when explicitly opted into via `<html data-theme="united-kingdom-national-health-service-scotland-for-patients">`,
so multiple themes can coexist in one document and be switched at runtime
by updating the `data-theme` attribute. */
```

## Usage

```html
<link rel="stylesheet" href="/themes/united-kingdom-national-health-service-scotland-for-patients.css" data-lily-theme-picker>
<html data-theme="united-kingdom-national-health-service-scotland-for-patients">
```

`theme-picker` loads this stylesheet by swapping the managed `<link>`'s `href` and setting `data-theme="united-kingdom-national-health-service-scotland-for-patients"` on the document root; `picker-bar` lists it by default. Installed from npm: `@lilydesignsystem/themes/united-kingdom-national-health-service-scotland-for-patients.css`. The stylesheet is standalone: every Lily component rule is inlined, in `@layer lily` with zero-specificity `:where()` selectors, so application CSS always wins.

## Related

- [Themes index](../../index.md) — the package contract.
- [AGENTS/theme.md](../../../../AGENTS/theme.md) — token shape and the headless forbidden list.
- [spec/theme](../../../../spec/theme/index.md) — the theme topic.
- [spec/theme-picker](../../../../spec/theme-picker/index.md) — runtime switching.
