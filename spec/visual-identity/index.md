# Visual identity principles (planned work)

## Summary

Eight proposals, plus items not adopted, from a review on 2026-11-01 of how design systems and brand guidelines treat
**visual identity**: the system of logo, colour, type, imagery, icons and layout that makes a product recognisably itself.
Lily is headless and ships no identity of its own, but its 63 `themes/` are each a visual identity expressed as tokens, and
its adopters carry an identity of their own. What Lily lacks is **a written identity policy** (what a theme may copy, what it
must not), **a documented way to apply an adopter's brand on top of a base theme**, and **a split between brand colour and
accessible content colour**. Nothing here is built yet: each item is an open acceptance criterion with a task in
[tasks.md](../../tasks.md) Phase 21.

## Scope

### In scope

The eight items below, each with a deliverable and a check; what Lily already does; what is deliberately not adopted.

### Explicitly out of scope

- Shipping an identity in the headless layer: no logo, colour, font, icon set or imagery
  ([headless](../headless/index.md), [theme](../theme/index.md)).
- Designing Lily's own logo or brand guidelines. The marks are in [trademarks](../trademarks.md).
- Copying any public-sector body's marks. A theme takes published colour, spacing and type values and never a logo, crest
  or restricted typeface (rule in [theme](../theme/index.md#public-sector-design-systems-beyond-the-uk-and-us-adopt-or-decline-2026-10-30-p17-t9)).

## Limits of the review

Read in full: Brad Frost, [The Many Faces of Themeable Design Systems](https://bradfrost.com/blog/post/the-many-faces-of-themeable-design-systems/).
Read as search excerpts only, not opened: the other pages cited below. The generic "what is a visual identity" results are
agency and marketing pages, so they are weak evidence and used here only for the shared vocabulary (logo, colour, type,
imagery, icons, layout, guidelines). The NHS England, NHS Wales and Leicestershire figures are as the search results quoted
them, and **local NHS adaptations disagree with the national rule**, so no single clear-space number is adopted. No typeface
licence terms were found. The GOV.UK pages state what a service must not do (identify as GOV.UK, use the crown or logotype
in its header) but not the crown image's licence.

## What Lily already matches

| The sources say                                                                                   | Lily today                                                                                                                                               |
| ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A visual identity is a system, not a logo; guidelines keep it consistent                          | 63 themes, each a token set plus a shared conformance contract enforced by `bin/check-theme` (provenance header, shared sections, contrast).             |
| One shared core, brand-specific values in a separate layer (Frost: core + brand)                  | Headless components with class hooks; themes in `@layer lily` using `:where()` so a consumer override wins; DTCG tokens in `themes/tokens/`.             |
| Keep token names constant across brands                                                           | Every theme defines the same `--color-*`, `--radius-*`, `--depth` and `--lily-*` names; `bin/check-theme` pins them.                                     |
| Brand colours are often not text-safe; derive an accessible variant                               | Content pairs are at least 4.5:1 in the six newest themes; `--lily-error-text` is derived from `--color-base-content`; `--contrast` reports every theme. |
| Use another body's code without its identity (GOV.UK: do not claim to be GOV.UK, no crown header) | Themes take values only, carry an "Independent implementation... not affiliated with" header, and ship no marks.                                         |
| Track a change of identity upstream (the 2024 GOV.UK crown update)                                | `themes/references.tsv` and `bin/check-theme-references` report a newer upstream major.                                                                  |
| One icon family                                                                                   | The ten page-header icons share one `viewBox="0 0 16 16"` grid and stroke style ([helpers](../../AGENTS/helpers.md)).                                    |

## The items

### 1. A written identity policy (AGENTS file and this topic)

**Gap.** The rule "values yes, marks no" lives in `spec/theme` under one decision. An adopter or maintainer adding a theme has
no short rule to read.

**Proposal.** `AGENTS/visual-identity.md`, loaded like the other AGENTS files, stating: (a) the headless layer carries no
identity; (b) a theme is an identity expressed as tokens; (c) it never includes a logo, crest, coat of arms or restricted
typeface; (d) it names its upstream and says it is not affiliated; (e) using a public-sector theme does not permit an adopter
to present their service as that body's (the GOV.UK service manual says this of GOV.UK); (f) the adopter's own marks, fonts
and imagery are supplied by the adopter. Add it to the `AGENTS.md` import list and `bin/sync`.

**Check.** `bin/test` fails when the file or its topic is missing (the pattern `AGENTS/responsive.md` uses).

### 2. A brand-overlay pattern on top of a base theme

**Gap.** Frost names the layers a theming system must support: multiple brands, sub-brands, white labels, campaigns, several
generations of a design language, product families, light and dark. Lily has the first and last; an adopter who wants
"the NHS England theme in our colours" has to fork a 4,000-line stylesheet.

**Proposal.** Document and test a **brand overlay**: a short stylesheet of at most about twenty custom properties (the
`--color-*` roles, `--radius-*`, `--lily-font-body-latin`) loaded after any base theme, scoped by `[data-brand="..."]` so it
composes with `[data-theme]` and the theme-picker. Ship one worked example and a `--check` that an overlay only sets
documented tokens and leaves no content pair under 4.5:1. This overlaps the theme generator in
[daisyui-lessons](../daisyui-lessons/index.md) item 3: build the overlay format first and let the generator emit it.

### 3. Brand colour separate from accessible content colour

**Gap.** Sources (WFP, Easol, HUB24) separate a brand colour, used for logo, header and footer where contrast is not
required, from the colours that carry text and borders. Lily's `--color-primary` is both, so an adopter's brand blue that
fails 4.5:1 on white has nowhere to go.

**Proposal.** Add two optional tokens to the shared theme section: `--lily-brand` (decorative: header band, rules, logo
background; never text) and `--lily-on-brand` (text on it), defaulting to `--color-primary` and `--color-primary-content`.
`bin/check-theme` checks the `--lily-on-brand` pair at 4.5:1 and that no component rule uses `--lily-brand` as a text
colour. Document the derivation recipe the sources describe: shift lightness until the pair passes, then record both values.

### 4. A logo slot: composition, clear space and accessible name

**Gap.** `government-identifier` is the only identity-bearing component. Every adopter's header needs a logo, and the sources
show clear-space rules vary: NHS England's print rule is the logo's full height, NHS Wales's is half, and local trusts add
their own minimums. Lily must therefore not hard-code one.

**Proposal.** A composition, not a component (the `AGENTS/components.md` pattern): a header link to the home page holding the
adopter's `<img alt>` or inline `<svg role="img" aria-label>`, with `--lily-logo-clear-space` and `--lily-logo-min-size`
defined by each theme (a theme without a value leaves them unset) and applied by the shared section. Document: the accessible
name is the organisation's name, not "logo"; a logo that is also a link names its destination (WCAG 2.5.3 Label in Name); a
logotype is exempt from text contrast (WCAG 1.4.3) but its surrounding non-text contrast is not; never put an adopter's logo
in a theme.

### 5. Typeface licence audit

**Gap.** Themes name font stacks they do not ship (NHS Frutiger, Rawline, Noto). The NHS England fonts page says Frutiger is
the national primary typeface; we found no licence terms.

**Proposal.** Add a `font_licence` column to `themes/references.tsv` (open licence, system font, licensed and not shipped,
unknown) for each theme's first named family, and a rule in `bin/check-theme` that every `--lily-font-body-latin` ends in a
generic family. Report the unknowns; do not guess them.

### 6. Icon and imagery style contract

**Proposal.** Record the existing icon rule as a contract in the identity AGENTS file (one `viewBox`, one stroke width, round
caps, `currentColor`, `aria-hidden` when decorative) so a new picker or an adopter's icon set matches, and add a check that
every bundled picker icon follows it. State plainly that photography and illustration direction is the adopter's: Lily ships
no imagery, and a `picture` or `figure` always carries a consumer-supplied `alt`.

### 7. `theme-color` follows the theme

**Gap.** GOV.UK's "without branding" guide tells services to update the `theme-color` value in their template, so the browser
chrome matches the identity. The theme-picker changes the page but not `<meta name="theme-color">`. No reference to
`theme-color` was found in the Svelte theme-picker source on 2026-11-01.

**Proposal.** An optional `themeColor` behaviour in the eight `theme-picker` catalogs: on apply, set the meta tag from the
theme's `--lily-brand` (item 3), creating it if absent, off by default. Idempotent, like every other apply
([helpers](../../AGENTS/helpers.md)).

### 8. Identity change log per theme

**Proposal.** Extend `bin/check-theme-references` so a recorded identity change (a new crown, a new palette) is a dated
`notes` entry in `themes/references.tsv`, and surface it on the theme's docs page as "Identity last aligned with upstream on
{date}". The 2026-10-29 NHS.UK re-baseline is the model.

## Not adopted

- **A logo or brand-guideline generator.** Out of scope; Lily is not a branding tool.
- **Bundled logos, crests or marks of any body**, including as "examples". Declined for the reason in `spec/theme`.
- **Photography or illustration style rules in the headless layer.** Imagery is the adopter's.
- **Motion identity.** Headless components never animate ([accessibility](../accessibility/index.md)); a motion language is
  an adopter's CSS, gated by `prefers-reduced-motion`.
- **A single clear-space or minimum-size number.** The sources disagree; each theme or adopter sets its own.
- **Brand voice and tone.** Every user-facing string is consumer-supplied ([internationalization](../internationalization/index.md)).

## Acceptance criteria

- [x] `AGENTS/visual-identity.md` exists, is imported by `AGENTS.md`, synced by `bin/sync`, and `bin/test` fails without it.
- [x] A brand overlay format is documented with one worked example, and `bin/check-theme --overlay` rejects an overlay that
      sets an undocumented token or leaves a content pair under 4.5:1.
- [x] `--lily-brand` and `--lily-on-brand` are in every theme's shared section and pinned by `bin/check-theme`.
- [x] The logo-slot composition is in `AGENTS/components.md` and `spec/visual-identity`, with an example page tested in one
      example app.
- [x] `themes/fonts.tsv` has a row for all 63 themes, with unknowns marked unknown (a separate file: `references.tsv` has only the 14 public-sector rows).
- [x] The icon contract is checked for every bundled picker icon.
- [ ] The theme-picker's optional `themeColor` works in all eight catalogs and is idempotent.
- [x] Each recorded identity change has a dated entry in `themes/identity-changes.tsv`, reported by `bin/check-theme-references` (no per-theme docs page exists to carry the line).

## Related topics

- [theme](../theme/index.md): tokens, the forbidden-literal list, the public-sector adopt-or-decline decisions.
- [daisyui-lessons](../daisyui-lessons/index.md): the theme generator the overlay format should feed.
- [competitive-position](../competitive-position/index.md): DTCG 2025.10 tokens and the public-sector reference versions.
- [dhcw-design-system-lessons](../dhcw-design-system-lessons/index.md): a worked case of re-baselining a national identity.
- [accessibility](../accessibility/index.md) and [responsive](../responsive/index.md): the contrast, target-size and reflow rules an identity must still meet.
- [trademarks](../trademarks.md): Lily's own marks.
- [citations](../citations/index.md).

## Sources

Read in full:

- [The Many Faces of Themeable Design Systems](https://bradfrost.com/blog/post/the-many-faces-of-themeable-design-systems/): Brad Frost; the seven theming situations.

Search excerpts, not opened (treat as leads):

- [Using GOV.UK Frontend without GOV.UK branding](https://frontend.design-system.service.gov.uk/using-govuk-frontend-without-govuk-branding/)
- [Making your service look like GOV.UK](https://www.gov.uk/service-manual/design/making-your-service-look-like-govuk)
- [GOV.UK crown update (DWP)](https://design-system.dwp.gov.uk/guidance/crown-update)
- [NHS England: fonts](https://www.england.nhs.uk/nhsidentity/identity-guidelines/fonts/) and [NHS logo](https://www.england.nhs.uk/nhsidentity/identity-guidelines/nhs-logo/)
- [NHS Wales branding guidelines](https://heiw.nhs.wales/files/nhs-wales-branding-guidelines-eng/)
- [WFP design system: colours](https://designsystem.wfp.org/docs/foundations/colours) (brand colours reserved for brand elements)
- [Easol design tokens](https://docs.easol.com/docs/sites-guides/site-styles/design-tokens) (`--text-on-brand`)
- [HUB24 colour foundations](https://hds.hub24.com.au/foundations/colour/)
- [Signify multi-branded design system](https://hike.one/work/signify-multi-branded-design-system)
- [How to create a strong visual identity](https://frontify.com/fr/blog/visual-identity): vocabulary only.

---

Lily™ and Lily Design System™ are trademarks.
