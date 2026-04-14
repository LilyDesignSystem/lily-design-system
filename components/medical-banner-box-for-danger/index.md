# Medical Banner Box For Danger

MedicalBannerBoxForDanger is a headless component for displaying critical medical record danger information such as reactions, warnings, alarms, and other danger-level clinical alerts. It renders a `<div>` with `role="region"`, `aria-label`, and `data-type="danger"` for consumer styling.

This component is useful in clinical interfaces, electronic health records, and patient summary screens where danger-level information must be prominently displayed and accessible.

## Implementation Notes

- Renders a `<div>` element with class `medical-banner-box-for-danger`
- Uses `role="region"` and `aria-label` for accessibility
- Uses `data-type="danger"` attribute for consumer CSS targeting
- Uses `children` slot for flexible content rendering
- Spreads `restProps` onto the `<div>` element for consumer extensibility

## Props

- `label`: string (required) -- accessible name applied via `aria-label`
- `children`: slot (required) -- the danger banner box content
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## Usage

```html
<MedicalBanner label="Patient summary">
  <MedicalBannerBox>
    <strong>Sarah Mitchell</strong> | NHS: 485 777 3456
  </MedicalBannerBox>
  <MedicalBannerBoxForDanger label="Allergies and reactions">
    <p>Penicillin -- Anaphylaxis</p>
    <p>Latex -- Skin rash</p>
  </MedicalBannerBoxForDanger>
</MedicalBanner>
```

```html
<MedicalBannerBoxForDanger label="Critical warnings">
  <p>Fall risk -- High</p>
  <p>MRSA -- Positive</p>
</MedicalBannerBoxForDanger>
```

## Keyboard Interactions

- None (passive layout element)

## ARIA

- `role="region"` -- establishes the box as a landmark for assistive technology
- `aria-label={label}` -- provides an accessible name describing the danger information

## When to Use

- Use inside MedicalBanner for danger-level information such as allergies, adverse drug reactions, warnings, or alarms
- Use to visually distinguish critical safety information from other banner content
- Use when clinicians need immediate visibility of life-threatening patient data
- Use for infection control alerts, fall risk warnings, or Do Not Resuscitate indicators

## When Not to Use

- Do not use for general warnings outside a clinical context -- use WarningCallout instead
- Do not use outside MedicalBanner -- it relies on the parent for landmark and live region semantics
- Do not use for routine clinical information -- use MedicalBannerBoxForAdvice for contacts, plans, and context

## Headless

This headless component provides a `<div>` with `role="region"`, `aria-label`, and `data-type="danger"`. The consumer is responsible for all CSS styling including background color (typically red/danger), text styling, and layout.

## Styles

The consumer provides all CSS styling. The component renders with a `.medical-banner-box-for-danger` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders a `<div>` element with class `medical-banner-box-for-danger`
- Verify `role="region"` is present
- Verify `aria-label` is set from the `label` prop
- Verify `data-type="danger"` is present
- Verify children content is rendered
- Verify pass-through attributes are applied

## Advice

- **Designers**: Use a strong danger color (e.g., red background) to visually distinguish this from normal information. Ensure text contrast meets WCAG AAA requirements.
- **Developers**: Always provide a meaningful `label` prop that describes the danger information category (e.g., "Allergies and reactions", "Critical warnings").

## Domain Knowledge

In clinical systems, danger-level information includes drug allergies, adverse reactions, critical alerts, and safety warnings that must be immediately visible to clinicians. This information is typically displayed with red or high-contrast styling per clinical UI conventions.

## References

- NHS UK Design System: https://service-manual.nhs.uk/design-system
