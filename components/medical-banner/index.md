# Medical Banner

MedicalBanner is a headless component for displaying prominent medical information messages at the top of a page. It renders as a `<div role="region" aria-live="polite">` with `data-context="medical"` and supports optional dismiss functionality. It follows the same pattern as Banner but is specifically intended for clinical and medical contexts.

This component is useful for patient alerts, clinical notifications, medical record summaries, and health-related announcements in electronic health record systems and clinical interfaces.

## Implementation Notes

- Renders as `<div role="region" aria-live="polite">` for screen reader announcements
- Uses reactive state to track visibility; dismissing sets `visible` to `false`
- Dismissible banners render a `<button type="button">` with a configurable `aria-label`
- `data-type` attribute exposes the variant (info, success, warning, error) for consumer CSS
- `data-context="medical"` attribute distinguishes this as a medical banner
- Uses `children` slot for flexible banner content rendering
- Spreads `...restProps` on the root `<div>` element for consumer extensibility

## Props

- `label`: string (required) -- accessible name for the banner via `aria-label`
- `type`: `"info"` | `"success"` | `"warning"` | `"error"` (default: `"info"`) -- banner variant
- `dismissible`: boolean (default: `false`) -- whether the banner can be dismissed
- `onclose`: `() => void` (optional) -- callback invoked when the banner is dismissed
- `closeLabel`: string (optional) -- accessible label for the dismiss button
- `children`: slot (required) -- the banner content
- `...restProps`: unknown -- additional attributes spread onto the root `<div>`

## Usage

```html
<MedicalBanner label="Patient summary">
  <MedicalBannerBox>
    <strong>Sarah Mitchell</strong> | NHS: 485 777 3456 | DOB: 15/03/1984
  </MedicalBannerBox>
  <MedicalBannerBoxForDanger label="Allergies and reactions">
    Allergies: Penicillin, Latex
  </MedicalBannerBoxForDanger>
  <MedicalBannerBoxForAdvice label="Care team">
    GP: Dr James Lee | Next appointment: 22 April 2025
  </MedicalBannerBoxForAdvice>
</MedicalBanner>
```

```html
<MedicalBanner label="Clinical notice" type="warning" dismissible closeLabel="Dismiss">
  Patient has pending lab results requiring urgent review.
</MedicalBanner>
```

## Keyboard Interactions

- Tab: Focus the dismiss button (when `dismissible` is `true`)
- Enter/Space: Activate the dismiss button to hide the banner

## ARIA

- `role="region"` -- establishes the banner as a landmark region
- `aria-live="polite"` -- ensures screen readers announce banner content
- `aria-label={label}` -- provides accessible name for the banner
- `aria-label={closeLabel}` -- provides accessible name for the dismiss button

## Composition

MedicalBanner can contain MedicalBannerBox for horizontal layout:

```html
<MedicalBanner label="Patient summary">
  <MedicalBannerBox>
    <span>Patient: John Smith</span>
    <span>NHS: 123 456 7890</span>
  </MedicalBannerBox>
</MedicalBanner>
```

## When to Use

- Use at the top of a clinical page to display critical patient identification and medical summary information
- Use in electronic health record systems where clinicians need quick access to patient context
- Use to present patient demographics, identifiers, and key clinical data in a persistent banner
- Use when medical context needs to be conveyed to assistive technologies via `data-context="medical"`
- Use as the parent container for MedicalBannerBox, MedicalBannerBoxForDanger, and MedicalBannerBoxForAdvice

## When Not to Use

- Do not use for non-medical applications -- use Banner instead
- Do not use for alerts or warnings about clinical conditions -- use Alert, WarningCallout, or CareCard
- Do not use for transient clinical notifications -- use Notification or Toast

## Headless

This component provides `role="region"` with `aria-live="polite"`, `data-type` for variants, `data-context="medical"`, optional dismiss button, and visibility state management. The consumer is responsible for all CSS.

## Styles

The consumer provides all CSS styling. The component renders with a `.medical-banner` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders a `<div>` element with class `medical-banner`
- Verify `role="region"` and `aria-live="polite"` are present
- Verify `data-context="medical"` is present
- Verify `aria-label` is set from the `label` prop
- Verify dismiss functionality works when `dismissible` is true
- Verify keyboard interactions work correctly

## Advice

- **Designers**: Use distinct styling for medical banners to differentiate them from generic site banners. Consider NHS blue or clinical color schemes.
- **Developers**: Always provide a meaningful `label` prop. Use `data-context="medical"` in CSS selectors for medical-specific styling.

## Domain Knowledge

Medical banners in clinical systems display patient-specific information, clinical alerts, and health record summaries. They must be highly accessible as they convey critical information to clinicians.

## References

- Parent pattern: Banner
- NHS UK Design System: https://service-manual.nhs.uk/design-system
