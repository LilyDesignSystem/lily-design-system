# MedicalBannerBoxForAdvice

## Metadata

- Component: medical-banner-box-for-advice
- PascalCase: MedicalBannerBoxForAdvice
- Description: a medical record banner box for advice information e.g. contacts, contexts, plans, etc.
- HTML tag: <div>
- CSS class: .medical-banner-box-for-advice
- Interactive: no

## Key Behaviors

- Renders a `<div>` element for displaying routine medical record advice information
- Intended for contacts, contexts, care plans, and other advice-level clinical information
- Uses `data-type="advice"` attribute for consumer CSS targeting
- Uses `children` slot for flexible content rendering
- Spreads `restProps` onto the `<div>` element for consumer extensibility

## ARIA

- `role="region"` -- establishes the box as a landmark for assistive technology
- `aria-label={label}` -- provides an accessible name describing the information

## Keyboard

- None (passive layout element)

## Props

- `label`: string (required) -- accessible name applied via `aria-label`
- `children`: slot (required) -- the advice banner box content
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## Acceptance Criteria

- [ ] Renders <div> element with class="medical-banner-box-for-advice"
- [ ] Has role="region" and aria-label
- [ ] Has data-type="advice"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .medical-banner-box-for-advice in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/medical-banner-box-for-advice.html
