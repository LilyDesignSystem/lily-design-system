# PhaseBanner

## Metadata

- Component: phase-banner
- PascalCase: PhaseBanner
- Description: a banner showing service development phase and inviting feedback
- HTML tag: <div>
- CSS class: .phase-banner
- Interactive: no

## Key Behaviors

- Renders a `<div>` with an embedded phase tag (e.g. "Alpha", "Beta") and a feedback link
- The phase tag is rendered as a `<strong>` so it is semantically emphasised
- Children slot is reserved for the descriptive text (often containing the feedback link)
- Renders no role by default — the banner is meta-information about the service, not a landmark
- Spreads `restProps` onto the root `<div>` for consumer customization

## ARIA

- Native semantics — no special ARIA needed
- Consumers may add `role="region"` + `aria-label` if they treat this banner as a landmark

## Keyboard

- Native anchor keyboard behaviour applies for any feedback link inside the banner

## Props

- `phase`: string (required) (default: —) — Phase label, e.g. "Alpha", "Beta", "Live"
- `children`: slot (required) (default: —) — Descriptive text and feedback link
- `...restProps`: HTML attributes (default: —) — Spread onto the root `<div>`

## Acceptance Criteria

- [ ] Renders <div> element with class="phase-banner"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: `.phase-banner` in css-style-sheet-template.css
- [GOV.UK Phase banners pattern](https://design-system.service.gov.uk/components/phase-banner/)
