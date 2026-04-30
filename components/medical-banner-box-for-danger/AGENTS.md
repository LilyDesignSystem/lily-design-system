# MedicalBannerBoxForDanger

## Metadata

- Component: medical-banner-box-for-danger
- PascalCase: MedicalBannerBoxForDanger
- Description: a medical record banner box for danger information e.g. reactions, warnings, alarms, etc.
- HTML tag: <div>
- CSS class: .medical-banner-box-for-danger
- Interactive: no

## Key Behaviors

- Renders a `<div>` element for displaying critical medical record danger information
- Intended for reactions, warnings, alarms, and other danger-level clinical alerts
- Uses `data-type="danger"` attribute for consumer CSS targeting
- Uses `children` slot for flexible content rendering
- Spreads `restProps` onto the `<div>` element for consumer extensibility

## ARIA

- `role="region"` -- establishes the box as a landmark for assistive technology
- `aria-label={label}` -- provides an accessible name describing the danger information

## Keyboard

- None (passive layout element)

## Props

- `label`: string (required) -- accessible name applied via `aria-label`
- `children`: slot (required) -- the danger banner box content
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## Acceptance Criteria

- [ ] Renders <div> element with class="medical-banner-box-for-danger"
- [ ] Has role="region" and aria-label
- [ ] Has data-type="danger"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .medical-banner-box-for-danger in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/medical-banner-box-for-danger.html
