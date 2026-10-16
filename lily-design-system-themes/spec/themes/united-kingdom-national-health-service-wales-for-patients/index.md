# United Kingdom National Health Service Wales For Patients

NHS Wales / GIG Cymru for the public, after the DHCW (Digital Health and Care Wales) design system: a navy primary (`oklch(33% 0.077 258)`, rendering `#1a355c`; DHCW cites `#1B365D`), an NHS Blue secondary (`#015eb8`) and a gold rail accent (`#ab8630`), with DHCW's yellow focus treatment and ledge buttons. Touch-first, bilingual-safe (the Frutiger stack covers the Welsh diacritics).

## At a glance

| | |
| --- | --- |
| Slug / `data-theme` | `united-kingdom-national-health-service-wales-for-patients` |
| Stylesheet | [`themes/united-kingdom-national-health-service-wales-for-patients.css`](../../../../themes/united-kingdom-national-health-service-wales-for-patients.css) |
| Token source | [`themes/tokens/united-kingdom-national-health-service-wales-for-patients.json`](../../../../themes/tokens/united-kingdom-national-health-service-wales-for-patients.json) |
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
| `--radius-selector` | `0.25rem` (4px) | chips, badges, switches, checkbox and radio containers |
| `--radius-field` | `0.25rem` (4px) | inputs, buttons, menu items, tooltips |
| `--radius-box` | `0.25rem` (4px) | cards, dialogs, drawers, hero blocks |
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
- Touch-first: buttons keep a 44px (`2.75rem`) minimum height and 12px/16px padding (WCAG 2.5.5 AAA target size), with generous rhythm for short reading sessions.

## Design notes (from the stylesheet header)

Verbatim from the top of the stylesheet. File names quoted in it may predate the `for-patients` / `for-practitioners` naming.

```text
Theme: united-kingdom-national-health-service-wales-patients
Brand: NHS Wales / GIG Cymru (Gwasanaeth Iechyd Gwladol Cymru) — patients
Format: Lily standalone theme


Upstream tracked: DHCW / NHS Wales design system (2026 — navy primary,
gold rail accent, yellow focus). Independent implementation against Lily
class hooks; not affiliated with or endorsed by NHS Wales / DHCW.
Patients variant
This is the *patients* / public-facing variant of the NHS Wales theme,
and the one to reach for whenever a member of the public will read or
interact with the screen: nhs.wales information pages, patient portals,
appointment booking, repeat-prescription requests, symptom checkers,
health-content articles, vaccination invitations, and any other surface
where the user is the patient (or a carer, parent, or relative acting
on the patient's behalf).

What the patients variant optimises for:

  - Touch-first reachability. Every control meets the WCAG 2.5.5
    target-size guidance (~44px / 2.5rem) so the same UI works on a
    phone held one-handed at a bus stop, a shared family tablet, and
    a desktop browser.

  - Generous rhythm. Padding, line-height, and gap tokens leave room
    for short readability sessions on small screens. Patients are
    not scanning dense data — they are reading a page or two and
    making one decision.

  - Familiar, friendly geometry. 0.25rem (4px) radii are slightly
    softer than the practitioners variant; the page feels closer to
    the public nhs.wales site than to a clinical workstation.

  - Bilingual, NHS-Identity-strict colour. The NHS / GIG mark, NHS
    Blue, and the canonical NHS palette dominate. Welsh-language
    content uses the same palette and the same Frutiger fallback
    stack (Frutiger supports the full Welsh diacritic set).

  - WCAG 2.2 AAA on body text and primary CTA contrast — the legal
    accessibility baseline for UK public-sector digital surfaces under
    the Public Sector Bodies (Websites and Mobile Applications)
    Accessibility Regulations 2018.

When to use this theme:

  - nhs.wales public information pages
  - Patient portals (My Wales, My Health Online and successors)
  - Patient-facing appointment booking and management
  - Patient-facing repeat-prescription / pharmacy requests
  - Patient-facing test-results and letters
  - Symptom checkers, self-referral, online consultation
  - Vaccination invitations and bookings
  - Public-facing campaign sites under any NHS Wales body

When NOT to use this theme:

  - Clinician-only workstations, EPR / eMAR / ePMA, results review
    (use `united-kingdom-national-health-service-wales-practitioners.css`)
  - Any surface where staff need to scan many rows of clinical data —
    this theme's rhythm makes that slow, not fast

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

Consumers wiring this theme should declare:
  font-family: Roboto, "Frutiger W01", "Frutiger", Arial, sans-serif;

The Frutiger entries are kept in the middle of the stack deliberately: an
NHS Wales organisation that already licenses Frutiger for print will fall
through to it if Roboto is unavailable, rather than dropping to Arial.

Geometry
Radii and borders follow DHCW's restrained, public-sector geometry:
  - 0.25rem (4px) field/box radius — DHCW's `nhsw-button-base` sets
    exactly this, so the value is now sourced rather than inferred
  - 0.25rem selector radius to match, a shade softer than NHS England's
    square selectors
  - 1px borders, no blur shadows (depth: 0), no grain (noise: 0)
  - Depth is expressed as a *hard 2px ledge* under buttons and a 4px one
    under cards, per DHCW, rather than as a blur. A hard offset is the
    one form of elevation that survives both forced-colours mode and a
    monochrome print, which is why every UK public-sector system that
    has thought about it has landed there.
========================================================================== */

Theme tokens — the colour, radius, border, and depth variables consumed
by every Lily component rule below. The theme applies by default (`:root`)
and also when explicitly opted into via
`<html data-theme="united-kingdom-national-health-service-wales-for-patients">`,
so multiple themes can coexist in one document and be switched at runtime
by updating the `data-theme` attribute. */
```

## Usage

```html
<link rel="stylesheet" href="/themes/united-kingdom-national-health-service-wales-for-patients.css" data-lily-theme-picker>
<html data-theme="united-kingdom-national-health-service-wales-for-patients">
```

`theme-picker` loads this stylesheet by swapping the managed `<link>`'s `href` and setting `data-theme="united-kingdom-national-health-service-wales-for-patients"` on the document root; `picker-bar` lists it by default. Installed from npm: `@lilydesignsystem/themes/united-kingdom-national-health-service-wales-for-patients.css`. The stylesheet is standalone: every Lily component rule is inlined, in `@layer lily` with zero-specificity `:where()` selectors, so application CSS always wins.

## Related

- [Themes index](../../index.md) — the package contract.
- [AGENTS/theme.md](../../../../AGENTS/theme.md) — token shape and the headless forbidden list.
- [spec/theme](../../../../spec/theme/index.md) — the theme topic.
- [spec/theme-picker](../../../../spec/theme-picker/index.md) — runtime switching.
