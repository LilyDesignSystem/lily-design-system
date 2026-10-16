# United Kingdom National Health Service Wales For Practitioners

NHS Wales / GIG Cymru for clinicians: the DHCW navy palette, yellow focus treatment and ledge buttons with clinical-density geometry for workstations, results review and prescribing.

## At a glance

| | |
| --- | --- |
| Slug / `data-theme` | `united-kingdom-national-health-service-wales-for-practitioners` |
| Stylesheet | [`themes/united-kingdom-national-health-service-wales-for-practitioners.css`](../../../../themes/united-kingdom-national-health-service-wales-for-practitioners.css) |
| Token source | [`themes/tokens/united-kingdom-national-health-service-wales-for-practitioners.json`](../../../../themes/tokens/united-kingdom-national-health-service-wales-for-practitioners.json) |
| Colour scheme | `light` |
| Group | UK and US government (listed last in `picker-bar`) |
| Primary | `#1a355c` (blue) |
| Page surface | `#ffffff` |
| Body text on page surface | `#202a31`, 14.6:1 |
| Text pairs at AAA (7:1) | 5 of 11 |
| Text pairs below AA (4.5:1) | 0 of 11 |

## Upstream

- **Tracks:** DHCW / NHS Wales design system (2026 — navy primary, gold rail accent, yellow focus). Independent implementation against Lily class hooks; not affiliated with or endorsed by NHS Wales / DHCW.
- **Affiliation:** Independent implementation against Lily class hooks; not affiliated with or endorsed by NHS Wales or DHCW.

## Palette

| Token | Value | sRGB | Role |
| --- | --- | --- | --- |
| `--color-base-100` | `oklch(100% 0 0)` | `#ffffff` | page surface |
| `--color-base-200` | `oklch(96% 0.004 214)` | `#eff2f3` | panels, cards, table headers |
| `--color-base-300` | `oklch(89% 0.007 234)` | `#d6dcdf` | dividers, hover rows, borders |
| `--color-base-content` | `oklch(28% 0.019 239)` | `#202a31` | body text |
| `--color-primary` | `oklch(33% 0.077 258)` | `#1a355c` | primary action, focus intent |
| `--color-primary-content` | `oklch(100% 0 0)` | `#ffffff` | text on primary |
| `--color-secondary` | `oklch(49% 0.161 255)` | `#015eb8` | hover and secondary chrome |
| `--color-secondary-content` | `oklch(100% 0 0)` | `#ffffff` | text on secondary |
| `--color-accent` | `oklch(64% 0.111 85)` | `#ab8630` | sparing emphasis |
| `--color-accent-content` | `oklch(23% 0.005 30)` | `#1f1c1b` | text on accent |
| `--color-neutral` | `oklch(48% 0.037 240)` | `#4b6171` | footer, code, tooltips |
| `--color-neutral-content` | `oklch(100% 0 0)` | `#ffffff` | text on neutral |
| `--color-info` | `oklch(54% 0.17 248)` | `#0071cb` | informational |
| `--color-info-content` | `oklch(100% 0 0)` | `#ffffff` | text on info |
| `--color-success` | `oklch(48% 0.121 154)` | `#00713c` | success, confirmation |
| `--color-success-content` | `oklch(100% 0 0)` | `#ffffff` | text on success |
| `--color-warning` | `oklch(86% 0.173 92)` | `#facc15` | warning, caution |
| `--color-warning-content` | `oklch(28% 0.019 239)` | `#202a31` | text on warning |
| `--color-error` | `oklch(56% 0.209 30)` | `#d32616` | error, destructive |
| `--color-error-content` | `oklch(100% 0 0)` | `#ffffff` | text on error |

## Shape and depth

| Token | Value | Applied to |
| --- | --- | --- |
| `--radius-selector` | `0.125rem` (2px) | chips, badges, switches, checkbox and radio containers |
| `--radius-field` | `0.125rem` (2px) | inputs, buttons, menu items, tooltips |
| `--radius-box` | `0.125rem` (2px) | cards, dialogs, drawers, hero blocks |
| `--border` | `1px` | stroke weight everywhere |
| `--depth` | `0` | flat: no shadows |
| `--noise` | `0` | no texture |

## Contrast

| Pair | Ratio | Level |
| --- | ---: | --- |
| `--color-base-content` on `--color-base-100` | 14.61:1 | AAA |
| `--color-base-content` on `--color-base-200` | 12.99:1 | AAA |
| `--color-base-content` on `--color-base-300` | 10.55:1 | AAA |
| `--color-primary-content` on `--color-primary` | 12.30:1 | AAA |
| `--color-secondary-content` on `--color-secondary` | 6.37:1 | AA |
| `--color-accent-content` on `--color-accent` | 4.99:1 | AA |
| `--color-neutral-content` on `--color-neutral` | 6.47:1 | AA |
| `--color-info-content` on `--color-info` | 4.97:1 | AA |
| `--color-success-content` on `--color-success` | 6.13:1 | AA |
| `--color-warning-content` on `--color-warning` | 9.54:1 | AAA |
| `--color-error-content` on `--color-error` | 5.17:1 | AA |

5 of 11 text pairs reach AAA (7:1). Every pair reaches at least AA (4.5:1).

## Behaviour beyond the tokens

- The focus indicator is DHCW's, set in the token block as `--lily-focus-ring: #FFEB3B` with `--lily-focus-text: #0B0C0C`, and deliberately **not** bound to `--color-primary` (a brand-coloured ring vanishes on a brand-coloured control). The ring is 3px with no offset.
- A focused button inverts to the yellow block with a dark underline bar (DHCW's `nhsw-button-base`), except while pressed; a focused link becomes a yellow block with a 4px bar drawn with `box-shadow`, so the line box does not move. Under `forced-colors: active` both fall back to a 3px `Highlight` outline.
- Buttons carry DHCW's 2px "ledge" shadow, weight 700 and `line-height: 1.25`; hover **darkens** the primary by 15% rather than swapping to the secondary token, and press moves the button 1px into the ledge. `prefers-reduced-motion` removes the transform and transitions.
- The five DHCW button styles are exposed as `data-variant` values on `[class$="-button"]` (`primary`, `secondary`, `outline`, `warning`, `exceptional`) because Lily is headless and mints no BEM modifier classes. `exceptional` is the warm-gold button (`#F5BB66` with dark text).
- Clinical density on top of the DHCW behaviour above: 14px body text, `--lily-space-md` 0.5rem, 28px (`1.75rem`) control min-heights and tighter radii for clinician workstations. Colour and focus are unchanged from the patients variant.

## Design notes (from the stylesheet header)

Verbatim from the top of the stylesheet. File names quoted in it may predate the `for-patients` / `for-practitioners` naming.

```text
Theme: united-kingdom-national-health-service-wales-practitioners
Brand: NHS Wales / GIG Cymru (Gwasanaeth Iechyd Gwladol Cymru) — practitioners
Format: Lily standalone theme


Upstream tracked: DHCW / NHS Wales design system (2026 — navy primary,
gold rail accent, yellow focus). Independent implementation against Lily
class hooks; not affiliated with or endorsed by NHS Wales / DHCW.
Practitioners variant
This is the *practitioners* / high-density variant of the NHS Wales
theme. It shares the NHS Wales colour palette, brand intent, and
component grammar with the patient-facing
`united-kingdom-national-health-service-wales-patients.css`, and
deliberately diverges on geometry and rhythm to serve a different
audience: healthcare practitioners (doctors, nurses, midwives,
pharmacists, AHPs, paramedics, dentists, ward clerks, MDT
coordinators) using electronic patient records, observation charts,
order entry, results review, scheduling boards, and ward whiteboards.

What changes vs. the patient-facing Wales theme:

  - Information density. Practitioners scan large datasets quickly
    (vital signs panels, medication lists, allergy summaries, results
    trends). Padding, line-height, gap, and margin tokens are roughly
    halved so more rows fit per screen without horizontal scrolling.

  - Smaller control targets. Patient-facing NHS digital surfaces
    target ~44px (WCAG 2.5.5 target-size guidance) because they are
    touched on phones by members of the public, often one-handed.
    Practitioner workstations are predominantly mouse + keyboard +
    barcode/RFID, so this variant shrinks min-heights to ~28px
    (1.75rem) on inputs and buttons. Touch-first practitioner devices
    (ward iPads, COWs) should stay on the patient-facing Wales theme
    or override these tokens.

  - Tighter borders / sharper radii. 0.125rem (2px) radius and 1px
    borders give a crisper, more "data-grid" feel that matches the
    visual language practitioners already know from PACS, LIMS, ePMA,
    and the EPR workstation shells (Cerner, Epic, System C, TPP SystmOne,
    Welsh Clinical Portal).

  - Smaller base type. 0.875rem (14px) body copy — the same baseline
    as most practitioner workstation shells. Still passes WCAG 1.4.4
    (resize text up to 200%) because tokens are rem-based.

  - Reduced shadows. Depth is for affordance, not decoration —
    practitioner environments are often glare-prone (bedside, theatre).

What stays the same:

  - The NHS Identity colour palette (NHS Blue, NHS Wales aqua-green
    accent, NHS Black, NHS Pale Grey, Emergency Services Red).
  - WCAG 2.2 AAA targets on body text and primary CTA contrast.
  - All Lily class hooks (492 components) — practitioner applications
    drop into the same headless components as patient-facing ones.
  - The bilingual NHS / GIG identity. Welsh-language practitioner UIs
    use the same diacritic-supporting font stack.

When to use this theme:

  - Electronic patient records (EPR), practitioner portals, results viewers
  - Observation charts, NEWS2 / PEWS / MEWS scoring screens
  - Medication administration records (eMAR), e-prescribing (ePMA)
  - Order communications (lab/radiology/pharmacy)
  - Theatre lists, ward boards, bed management dashboards
  - Discharge summaries, MDT (multi-disciplinary team) review screens
  - Any practitioner-staff-only workstation interface

When NOT to use this theme:

  - Patient-facing NHS Wales websites (use the patients Wales theme)
  - Patient portals, appointment booking by patients (use the patients
    Wales theme — patient touch targets must meet WCAG 2.5.5)
  - Anywhere a member of the public reads or interacts with the screen

Provenance
NHS Wales is one of four national NHS bodies in the United Kingdom (alongside
NHS England, NHS Scotland, and Health and Social Care Northern Ireland). It
is administered by the Welsh Government on behalf of seven local health
boards and three national NHS trusts (Public Health Wales, Velindre
University NHS Trust, and the Welsh Ambulance Services NHS Trust), plus
Health Education and Improvement Wales (HEIW) and Digital Health and Care
Wales (DHCW).

The NHS Wales visual identity is the standard NHS Identity (the same
lozenge mark, the same Frutiger typeface, the same official colour palette)
presented bilingually as "NHS / GIG" — Gwasanaeth Iechyd Gwladol being the
Welsh translation of National Health Service. Every NHS Wales organisation
(HEIW, PHW, DHCW, Welsh Ambulance, Velindre, Aneurin Bevan UHB, Betsi
Cadwaladr UHB, Cardiff and Vale UHB, Cwm Taf Morgannwg UHB, Hywel Dda UHB,
Powys THB, Swansea Bay UHB) operates under this shared mark.

NHS Wales now *does* publish a digital design system. Digital Health and
Care Wales maintains the DHCW / NHSW design system and its accompanying
SCSS component library, which extends the NHS service manual with
Wales-specific tokens and components:
  https://dhcw-digital-health-and-care-wales.github.io/nhsw-component-library/
  https://github.com/dhcw-digital-health-and-care-wales/nhsw-component-library

This theme is derived from, in order of precedence:
  1. The DHCW / NHSW component library tokens (`src/tokens/_colours.scss`,
     `_typography.scss`, `_spacing.scss`) — the authoritative Wales source
  2. The NHS Identity Guidelines colour palette, which DHCW still sits
     inside for the lozenge, NHS Blue, and the support families
     https://www.england.nhs.uk/nhsidentity/identity-guidelines/colours/
  3. The NHS Wales branding guidelines (HEIW, 2022)
     https://heiw.nhs.wales/files/nhs-wales-branding-guidelines-eng/
  4. The NHS digital service manual, which DHCW explicitly builds on and
     diverges from only where it documents a reason
     https://service-manual.nhs.uk/design-system/styles/colour
  5. The NHS Wales Website Style Guide v4.0 (October 2022)
     https://cmssupport.nhs.wales/files/cms-documents/cms-style-guide/

What distinguishes the Wales theme from the England theme
Earlier revisions of this file leaned on the NHS *Aqua Green* support
colour as the Wales accent. That was an inference drawn before DHCW
published anything; the published system makes a different choice, and
evidence beats inference. The three concrete DHCW divergences are:

  - **Navy, not NHS Blue, carries action.** DHCW's primary button is
    `#1B365D` (`$nhsw-colour-button-primary`), and its "text blue" is the
    same navy. NHS Blue `#005EB8` is retained for links and the site
    header band, so the page still reads as NHS at a glance, but the
    thing you click is navy. NHS England, by contrast, uses green
    `#007F3B` for its primary button.

  - **Gold is the accent.** `$nhsw-colour-border-gold` `#AA8630` rails
    the DHCW inset-text component and tops the mobile bottom-nav bar. It
    is the only hue DHCW introduces that is not in the NHS Identity
    palette, so it — not aqua — is the Wales signature here. Gold is a
    *rail* colour only; see the accessibility note below.

  - **Yellow focus, black underline.** DHCW mandates the GDS-lineage
    focus indicator (`#FFEB3B` block with a `#0B0C0C` bar) rather than a
    brand-coloured outline, and applies it to every interactive element.
    On a practitioner workstation this matters more, not less: keyboard
    is the primary input device for clinical data entry, so the focus
    indicator is load-bearing rather than an accessibility afterthought.

NHS Aqua Green is not discarded — it survives as `--lily-support-aqua`
and as the `aqua-green` tag tone, both of which DHCW itself ships. And
Cymru's cultural palette still shows through: the error red below is
Pantone 485, the red of Y Ddraig Goch, and the gold reads as the
daffodil rather than as a decorative flourish.

Colour-space notes
Values are expressed in OKLCH (lightness % / chroma / hue°) to match the
sibling NHS themes (England, Scotland) in this directory. OKLCH was chosen
across the Lily theme suite because it gives perceptually uniform lightness
steps, which helps maintain WCAG 2.2 AAA contrast ratios when the theme is
recoloured for high-contrast or dark variants.

Each colour comment below gives the canonical sRGB hex, its source
(a DHCW SCSS variable name, or an NHS Identity Pantone reference where
the colour comes from the identity palette rather than from DHCW), and
the rounded OKLCH translation that this file uses. Where a value is
DHCW's, the SCSS variable name is quoted so the derivation can be
checked against the published library rather than taken on trust.

Accessibility
Target: WCAG 2.2 AAA (per Lily's accessibility design principle).
Measured against --color-base-100 (#FFFFFF) unless stated:
  - Body text (--color-base-content, #212B32): 14.4:1 — AAA
  - --color-primary (DHCW navy #1B365D): 12.1:1 — AAA at any size
  - --color-secondary (NHS Blue #005EB8): 6.4:1 — AAA large, AA body
  - --color-error (Pantone 485 #DA291C): 4.6:1 — AA large only
  - --lily-focus-text on --lily-focus-ring (#0B0C0C on #FFEB3B): 16.0:1
  - Every DHCW tag tone below: ≥ 7.2:1 — all AAA

The tag tones matter more in the practitioner variant than the patient
one: a worklist row that encodes triage, specialty, or result status in a
chip is exactly the "colour-only meaning" trap WCAG 1.4.1 warns about.
Every tone below carries a distinct border as well as a distinct fill,
and none of them is legible-by-hue alone — pair each with a text label.

The gold caveat, stated plainly
DHCW gold #AA8630 is **3.4:1 on white**. That is below AA for body text
and below the 3:1 floor for adjacent-colour meaning only by a hair. It is
therefore declared as --color-accent but used *exclusively* as a rail,
border, and underline colour, never as a text colour and never as a fill
behind text. Where a Lily component fills with the accent and puts a
label on it (`.ai-label`), this theme substitutes --lily-accent-deep
(#554318, 9.5:1 with white) instead. Do not "fix" that by putting text
back on the bright gold.

Components whose colour cannot reach AAA behind body copy (warning
yellow, gold) carry inverted or substituted content colours so the paired
text stays legible.

Typography (informational — Lily does not bake font choices into the theme)
DHCW departs from the NHS Identity here. The NHSW component library sets
`$nhsw-font-family-base: Roboto, Arial, sans-serif` — Roboto, not
Frutiger. The likely reason is licensing: Frutiger is a paid typeface and
Roboto is not, which matters for a system meant to be adopted across
seven health boards and three trusts without a per-seat font bill.

Both typefaces carry the full Welsh diacritic set (â, ê, î, ô, û, ŵ, ŷ
and their uppercase forms), so either is safe for bilingual pages — but
check any *substituted* fallback: ŵ and ŷ are the two characters most
often missing from an otherwise complete font, and they are common in
Welsh (e.g. "gŵr", "gwŷr", "Cymraeg gyfŵn").

DHCW type scale, for consumers matching it exactly (desktop / mobile):
  h1 3rem/2rem · h2 2.25rem/1.6875rem · h3 1.625rem/1.375rem
  h4 1.375rem/1.1875rem · h5 1.1875rem/1rem
  body 1.1875rem/1rem · body-small 1rem

Practitioner surfaces routinely run body copy at the `body-small` step
(1rem) to fit a worklist on one screen. That is acceptable here because
the text-size-picker helper is expected to be present on the page shell;
it is not acceptable as a fixed floor. Never ship below 1rem.

Consumers wiring this theme should declare:
  font-family: Roboto, "Frutiger W01", "Frutiger", Arial, sans-serif;

The Frutiger entries are kept in the middle of the stack deliberately: an
NHS Wales organisation that already licenses Frutiger for print will fall
through to it if Roboto is unavailable, rather than dropping to Arial.

Geometry
Practitioner geometry is crisper than the patients Wales theme:
  - 0.125rem (2px) selector/field/box radius — almost-square corners
    match the data-grid aesthetic of practitioner workstation shells,
    and halve DHCW's own 4px
  - 1px borders, no blur shadows (depth: 0), no grain (noise: 0)
  - Density tokens collapse the spacing scale to roughly half:
    xs 2px, sm 4px, md 8px, lg 12px, xl 16px
  - Depth is expressed as a *hard ledge* under buttons and cards, per
    DHCW, rather than as a blur. A hard offset is the one form of
    elevation that survives both forced-colours mode and a monochrome
    print. DHCW's ledges are 2px (button) and 4px (card); this variant
    halves both to 1px and 2px, in line with the shadow scale.

Four things deliberately do NOT get the density treatment, because
shrinking them would cost correctness rather than space:
  - the focus ring (3px, zero offset — full DHCW width)
  - the inset-text rail (0.5rem — it must out-weigh the table rules it
    sits among, so it is the one measurement here that grows)
  - the warning-callout band (full type size — its job is to interrupt)
  - Welsh-language wrapping (see the bilingual section) — a truncated
    Welsh column header is a clinician reading the wrong column
========================================================================== */

Theme tokens — the colour, radius, border, and depth variables consumed
by every Lily component rule below. The theme applies by default (`:root`)
and also when explicitly opted into via
`<html data-theme="united-kingdom-national-health-service-wales-for-practitioners">`,
so multiple themes can coexist in one document and be switched at runtime
by updating the `data-theme` attribute. */
```

## Usage

```html
<link rel="stylesheet" href="/themes/united-kingdom-national-health-service-wales-for-practitioners.css" data-lily-theme-picker>
<html data-theme="united-kingdom-national-health-service-wales-for-practitioners">
```

`theme-picker` loads this stylesheet by swapping the managed `<link>`'s `href` and setting `data-theme="united-kingdom-national-health-service-wales-for-practitioners"` on the document root; `picker-bar` lists it by default. Installed from npm: `@lilydesignsystem/themes/united-kingdom-national-health-service-wales-for-practitioners.css`. The stylesheet is standalone: every Lily component rule is inlined, in `@layer lily` with zero-specificity `:where()` selectors, so application CSS always wins.

## Related

- [Themes index](../../index.md) — the package contract.
- [AGENTS/theme.md](../../../../AGENTS/theme.md) — token shape and the headless forbidden list.
- [spec/theme](../../../../spec/theme/index.md) — the theme topic.
- [spec/theme-picker](../../../../spec/theme-picker/index.md) — runtime switching.
