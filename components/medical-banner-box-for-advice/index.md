# Medical Banner Box For Advice

MedicalBannerBoxForAdvice is a headless component for displaying routine medical record advice information such as contacts, contexts, care plans, and other advice-level clinical information. It renders a `<div>` with `role="region"`, `aria-label`, and `data-type="advice"` for consumer styling.

This component is useful in clinical interfaces, electronic health records, and patient summary screens where advice-level information should be clearly presented alongside danger-level information.

## Implementation Notes

- Renders a `<div>` element with class `medical-banner-box-for-advice`
- Uses `role="region"` and `aria-label` for accessibility
- Uses `data-type="advice"` attribute for consumer CSS targeting
- Uses `children` slot for flexible content rendering
- Spreads `restProps` onto the `<div>` element for consumer extensibility

## Props

- `label`: string (required) -- accessible name applied via `aria-label`
- `children`: slot (required) -- the advice banner box content
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## Usage

```html
<MedicalBanner label="Patient summary">
  <MedicalBannerBox>
    <strong>Sarah Mitchell</strong> | NHS: 485 777 3456
  </MedicalBannerBox>
  <MedicalBannerBoxForAdvice label="Care team contacts">
    <p>GP: Dr James Lee</p>
    <p>District Nurse: Nurse Jones</p>
    <p>Next appointment: 22 April 2025</p>
  </MedicalBannerBoxForAdvice>
</MedicalBanner>
```

```html
<MedicalBannerBoxForAdvice label="Discharge plan">
  <p>Target discharge: 15 April 2025</p>
  <p>Follow-up: Outpatient cardiology in 2 weeks</p>
</MedicalBannerBoxForAdvice>
```

## Keyboard Interactions

- None (passive layout element)

## ARIA

- `role="region"` -- establishes the box as a landmark for assistive technology
- `aria-label={label}` -- provides an accessible name describing the information

## When to Use

- Use inside MedicalBanner for advice-level information such as care contacts, clinical context, and care plans
- Use to display the patient's GP, key worker, next appointment, or care pathway
- Use when clinicians need quick reference to routine supporting information alongside the patient banner
- Use for displaying treatment goals, discharge plans, or referral information

## When Not to Use

- Do not use for danger-level information such as allergies or adverse reactions -- use MedicalBannerBoxForDanger
- Do not use outside MedicalBanner -- it relies on the parent for landmark and live region semantics
- Do not use for system-level alerts or warnings -- use Alert or WarningCallout

## Headless

This headless component provides a `<div>` with `role="region"`, `aria-label`, and `data-type="advice"`. The consumer is responsible for all CSS styling including background color, text styling, and layout.

## Styles

The consumer provides all CSS styling. The component renders with a `.medical-banner-box-for-advice` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders a `<div>` element with class `medical-banner-box-for-advice`
- Verify `role="region"` is present
- Verify `aria-label` is set from the `label` prop
- Verify `data-type="advice"` is present
- Verify children content is rendered
- Verify pass-through attributes are applied

## Advice

- **Designers**: Use a neutral background color to visually distinguish this from danger information. Ensure text contrast meets WCAG AAA requirements.
- **Developers**: Always provide a meaningful `label` prop that describes the information category (e.g., "Care team contacts", "Care plan summary").

## Domain Knowledge

In clinical systems, advice-level information includes care team contacts, care plans, clinical context, and routine patient data. This information is typically displayed with neutral styling to contrast with danger-level alerts.

## References

- NHS UK Design System: https://service-manual.nhs.uk/design-system
