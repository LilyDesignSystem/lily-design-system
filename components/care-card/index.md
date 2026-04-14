# Care Card

A care card is a healthcare-oriented component for displaying medical guidance with varying levels of urgency. Inspired by the NHS England design system, care cards communicate health advice in three tiers: non-urgent (speak to a GP), urgent (visit A&E or call 111), and immediate (call 999).

Each care card has a heading that describes the action and a body containing the relevant advice or conditions. The `data-type` attribute allows consumers to apply urgency-appropriate styling (e.g., blue for non-urgent, red for immediate). The card is rendered as a `<section>` landmark with an accessible label derived from the heading.

## Implementation Notes

- NHS England inspired pattern for healthcare guidance
- Three urgency levels: non-urgent, urgent, immediate
- Renders as `<section role="region">` with heading for landmark navigation
- `aria-label` defaults to the heading text, overridable via the `label` prop
- Uses `<h2>` for the heading element
- `data-type` attribute exposes the urgency level for consumer CSS styling
- Content is provided through child elements

## Props

- `type`: "non-urgent" | "urgent" | "immediate" (default: "non-urgent") -- urgency level
- `heading`: string (required) -- heading text for the care card
- `label`: string (optional) -- `aria-label` override; defaults to heading text
- `children`: slot (required) -- the care card body content
- `...restProps`: Any additional HTML attributes passed to the `<section>` element

## Usage

```html
<CareCard type="non-urgent" heading="See a GP if:">
  <ul>
    <li>your symptoms do not improve after 2 weeks</li>
    <li>you have a high temperature for more than 3 days</li>
  </ul>
</CareCard>
```

```html
<CareCard type="urgent" heading="Ask for an urgent GP appointment or call 111 if:">
  <ul>
    <li>you have difficulty breathing</li>
    <li>you have chest pain</li>
  </ul>
</CareCard>
```

```html
<CareCard type="immediate" heading="Call 999 if:">
  <ul>
    <li>someone is unconscious</li>
    <li>someone is having a seizure for the first time</li>
  </ul>
</CareCard>
```

## Keyboard Interactions

- None -- this component is a passive content container

## ARIA

- `role="region"` -- identifies the card as a named landmark
- `aria-label` -- set from `label` prop or `heading` prop for screen reader identification
- `data-type` -- exposes urgency level for consumer styling hooks

## When to Use

- Use to provide medical care instructions with urgency levels (non-urgent, urgent, emergency)
- Use when directing users to seek medical help, such as "See a GP" or "Call 999"
- Use to communicate the appropriate level of medical response for symptoms described on the page
- Use when medical guidance needs to be visually distinct from surrounding content with clear urgency indicators
- Use on health information pages where users need actionable next steps based on their symptoms

## When Not to Use

- Do not use for general warnings without medical context -- use WarningCallout instead
- Do not use for informational callouts or supplementary notes -- use InformationCallout or InsetText
- Do not use for system alerts or application-level messages -- use Alert or Banner
- Do not use for patient record banners -- use MedicalBanner with MedicalBannerBoxForDanger

## Headless

This headless CareCard component provides the semantic `<section>` with `role="region"`, accessible labeling from the heading, and a `data-type` attribute exposing the urgency level. The consumer provides all visual styling including urgency-specific colors (e.g., blue for non-urgent, red for immediate), card borders, spacing, and typography.


## Styles

The consumer provides all CSS styling. The component renders with a `.care-card` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `care-card`
- Verify role="region"` -- identifies the card as a named landmark
- Verify aria-label` -- set from `label` prop or `heading` prop for screen reader identification
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Use distinct, high-contrast colors for each urgency level so users can quickly identify severity. Follow NHS design patterns for familiarity in healthcare contexts.
- **Developers**: Always set the `type` prop explicitly to match the clinical urgency. Use the `data-type` attribute in your CSS selectors to apply urgency-specific styling.

## References

- NHS England Care Cards: https://service-manual.nhs.uk/design-system/components/care-cards
