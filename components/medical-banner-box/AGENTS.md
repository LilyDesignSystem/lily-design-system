# MedicalBannerBox

## Metadata

- Component: medical-banner-box
- PascalCase: MedicalBannerBox
- Description: a medical banner box that is inside a medical-banner component, using flexbox horizontal, with medical information
- HTML tag: <div>
- CSS class: .medical-banner-box
- Interactive: no

## Key Behaviors

- Renders a `<div>` element intended to be placed inside a MedicalBanner component
- Provides a flexbox horizontal layout container for medical banner content
- Uses `data-context="medical"` attribute for consumer CSS targeting
- Uses `children` slot for flexible content rendering
- Spreads `restProps` onto the `<div>` element for consumer extensibility

## ARIA

- No additional ARIA attributes required; the parent MedicalBanner provides the landmark role and aria-live region

## Keyboard

- None (passive layout element)

## Props

- `label`: string (optional) -- accessible name applied via `aria-label` if needed
- `children`: slot (required) -- the medical banner box content
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## Acceptance Criteria

- [ ] Renders <div> element with class="medical-banner-box"
- [ ] Has data-context="medical"
- [ ] Works inside a MedicalBanner component
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## Composition

MedicalBannerBox is designed to be used inside a MedicalBanner:

```html
<MedicalBanner label="Patient summary">
  <MedicalBannerBox>
    <span>Patient: John Smith</span>
    <span>NHS: 123 456 7890</span>
  </MedicalBannerBox>
</MedicalBanner>
```

## References

- Documentation: index.md
- CSS class: .medical-banner-box in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/medical-banner-box.html
- Parent component: MedicalBanner
