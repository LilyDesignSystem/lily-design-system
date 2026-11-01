## Visual identity design principles rules

Lily is headless: it ships no identity of its own. A visual identity (logo, colour, type, imagery, icons, layout) is applied
by a theme or by the adopter. Full topic, with the research and the planned work:
[spec/visual-identity/index.md](../spec/visual-identity/index.md).

### Rules

- **The headless layer carries no identity.** No logo, colour, font, icon set or imagery (see [headless.md](headless.md) and
  [theme.md](theme.md)). The one exception, the page-header pickers' bundled SVG icons, is always overridable.
- **A theme is an identity expressed as tokens.** It takes published colour, spacing and type values and uses the shared
  token names, so a component never knows which identity it is wearing.
- **No marks in a theme.** Never a logo, crest, coat of arms or typeface whose licence bars redistribution, whoever the
  upstream is. Name the font stack; do not ship the font.
- **Name the upstream and disclaim it.** Every theme's provenance header says what it follows and that it is an independent
  implementation, not affiliated with that body (`bin/check-theme` rule 6).
- **Using a public-sector theme is not being that body.** A service that adopts the GOV.UK, NHS, Canada or other
  public-sector theme must not present itself as that body or use its marks (the GOV.UK service manual says this of GOV.UK).
  The adopter supplies their own logo, name and fonts.
- **The adopter supplies marks, fonts and imagery.** A logo is the adopter's `<img alt>` or `<svg role="img" aria-label>`,
  named for the organisation, never "logo". `picture` and `figure` always carry consumer-supplied text alternatives.
- **Brand colour is not text colour.** A brand colour that fails 4.5:1 may colour a band, rule or logo background, never text
  or a control's boundary; text and borders use the theme's content pairs (WCAG 1.4.3, 1.4.11).
- **Fonts are named, never shipped, and their licence is recorded.** `themes/fonts.tsv` has a row per theme (system font, or a
  named font with its licence and whether that is verified); an unknown stays unknown. Every font stack ends in a generic family.
- **One icon family.** Each bundled page-header picker icon is an inline `<svg class="{helper}-picker-icon">` on a
  `viewBox="0 0 16 16"` grid, drawn with `stroke="currentColor"`, `stroke-width="1.6"` and round caps and joins, sized in `rem`,
  and `aria-hidden="true"` (decorative: the button's `aria-label` is the name). An adopter's replacement icon follows the same
  contract. `date-time-picker`'s calendar glyph is exempt. `bin/check-picker-icons` enforces it for all 80 icons in the eight catalogs.
  Photography and illustration style are the adopter's: Lily ships no imagery.
- **Do not hard-code one body's clear space or size.** National and local guidelines disagree; a theme or adopter sets its own.
- **Identity changes are dated.** When an upstream changes its identity, re-baseline the theme and record it in
  `themes/references.tsv`.

### Brand overlay

To re-colour a base theme without forking it, write an overlay in [`brand-overlays/`](../brand-overlays): one rule,
`:root[data-brand="name"]`, loaded after the theme, with `data-brand="name"` on the root element. It sets only the documented
tokens (the eight colour roles with their `-content`, `--lily-brand` / `--lily-on-brand`, the three radii,
`--lily-font-body-latin`), at most twenty declarations. Each colour pair is set together and is at least 4.5:1; the font stack
ends in a generic family. `bin/check-theme --overlay` (in `bin/test`) enforces it; `brand-overlays/example.css` is the worked
example (a fictional brand).

### Planned (not yet built)

Logo-slot composition, `theme-color`, identity change log: tasks P21-T4, P21-T7 and
P21-T8 in [tasks.md](../tasks.md).

### Checks

- `bin/check-theme` enforces the provenance header and contrast.
- `bin/test` fails when this file or its topic is missing, or `AGENTS.md` does not load it.
