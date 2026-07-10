# AddressographBox

An addressograph-box is a box that shows a person's identification details, such as name, date of birth, tracking information (e.g., medical record number, patient number), and salient notations (e.g., allergy alerts, fall risk).

This headless component renders a `<div>` with class `addressograph-box`. The consumer supplies the identifying fields, layout, and any salient warning iconography as children. The component intentionally does not pick which identifiers to show — that is a domain concern (healthcare, logistics, mail handling, etc.).

## Implementation Notes

- Uses `<div>` element with class `addressograph-box`
- `aria-label` provides a single accessible name for the box (e.g., "Patient identification")
- Contains slots for name, date of birth, identifier, ward/location, and salient notations

## Props

- `label`: string (optional) -- accessible label for the addressograph-box box
- `children`: slot (required) -- identifying content (name, DOB, identifier, notations)
- `...restProps`: Any additional HTML attributes

## Usage

```html
<AddressographBox label="Patient identification">
  <p>Jane Doe</p>
  <p>Date of birth: 1980-05-12</p>
  <p>NHS number: 943 476 5919</p>
  <p>Ward: A3</p>
  <p>Allergy alert: penicillin</p>
</AddressographBox>
```

## Keyboard Interactions

- None -- the addressograph-box is informational, not interactive

## ARIA

- `aria-label` -- describes the box for screen readers (e.g., "Patient identification")

## When to Use

- Use to display a single subject's identifying details together in a compact, scannable block.
- Use in clinical contexts to show patient identification alongside admission, ward, and salient alert information.
- Use in logistics or mail-handling contexts to show recipient details and tracking information together.
- Use when staff need to verify identity at a glance before performing an action.

## When Not to Use

- Do not use for a general profile page or person summary — use `person` instead.
- Do not use for a list of multiple people — wrap individual `addressograph-box` components, or use a `data-table`.
- Do not use as a substitute for accessible field labels in a form — use `field` with `label`.
- Do not encode safety-critical alerts with colour alone (WCAG 1.4.1) — include text or icon.

## Headless

This component provides a `<div>` element with optional `aria-label` and zero visual styling. The consumer is responsible for all CSS, layout, typography, alert iconography, and any print-specific styling (addressograph-box boxes are commonly printed onto patient labels and stickers).

## Styles

The consumer provides all CSS styling. The component renders with a `.addressograph-box` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders a `<div>` element with class `addressograph-box`
- Verify `aria-label` is applied when provided
- Verify child content slots are rendered correctly
- Verify pass-through attributes are applied

## Domain Knowledge

The term "addressograph-box" comes from the AddressographBox Company's mid-20th-century mechanical embossing machines used to stamp patient identification onto paper records and labels. The pattern survives as a digital convention in healthcare: a single box of identifying fields appears at the top of charts, admission forms, drug charts, and printed labels so staff can verify identity before any clinical action.

## Advice

- **Designers**: Keep the identifying fields tightly grouped and visually distinct from the surrounding page. Always show name and date of birth; show the safety-critical alerts prominently.
- **Developers**: Use the `label` prop to describe the box ("Patient identification", "Recipient details") so screen readers announce a single intentional region. Pass identifying fields as separate children rather than concatenated strings so consumers can style each.

## Related components

- `person` — a person component that contains other person-related information
- `government-identifier` — an identifier section with a parent agency logo, agency name, and required government links

## References

- [MDN div element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div)

---

Lily™ and Lily Design System™ are trademarks.
