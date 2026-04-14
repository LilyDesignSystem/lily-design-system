# Tour

Tour is a headless component that serves as a container for a guided tour experience. It wraps TourList and TourListItem components to provide a step-by-step walkthrough of features, sightseeing pathways, or product demonstrations.

Use this component as the outer wrapper for guided tours, onboarding flows, feature walkthroughs, or any sequential step-by-step experience.

## Implementation Notes

- Renders a `<div>` element as the tour container
- Uses `aria-label` for an accessible name describing the tour
- Accepts `className` for CSS class targeting
- Spreads `restProps` onto the `<div>` element for consumer customization
- Children slot contains TourList with TourListItem steps

## Props

- `label`: string (required) -- accessible name for the tour via `aria-label`
- `className`: string (default: `""`) -- CSS class name for the container
- `children`: slot (required) -- tour content, typically a TourList
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## Usage

```html
<Tour label="Patient record system walkthrough">
  <TourList label="Getting started" active={showTour}>
    <TourListItem label="Welcome" current={step === 0} stepNumber={1} totalSteps={3}>
      <p>Welcome to the patient record system. This tour will show you the key features.</p>
      <Button onclick={() => step++}>Next</Button>
      <Button onclick={() => showTour = false}>Skip tour</Button>
    </TourListItem>
    <TourListItem label="Search patients" current={step === 1} stepNumber={2} totalSteps={3}>
      <p>Use the search bar to find patients by name, NHS number, or date of birth.</p>
      <Button onclick={() => step--}>Back</Button>
      <Button onclick={() => step++}>Next</Button>
    </TourListItem>
    <TourListItem label="View record" current={step === 2} stepNumber={3} totalSteps={3}>
      <p>Click a patient name to open their full record, including demographics and appointments.</p>
      <Button onclick={() => step--}>Back</Button>
      <Button onclick={() => showTour = false}>Finish</Button>
    </TourListItem>
  </TourList>
</Tour>
```

## Keyboard Interactions

Standard keyboard interactions provided by child components. The Tour container itself is not interactive.

## ARIA

- `aria-label={label}` -- provides an accessible name for the tour container

## When to Use

- Use for guided walkthroughs for onboarding, feature discovery, or demonstration paths.
- Use when new users need step-by-step introduction to an interface.
- Use with TourList and TourListItem children to define the tour steps.
- Use for first-time user experiences, new feature announcements, or contextual help.
- Use when guidance needs a structured, sequential format with progress indicators.

## When Not to Use

- Do not use for sequential task completion -- use TaskList instead.
- Do not use for page navigation or table of contents -- use ContentsNav instead.
- Do not use for simple ordered lists -- use CheckList instead.

## Headless

This headless component renders a `<div>` with `aria-label`. The consumer provides all visual styling including layout, progress indicators, step highlights, and navigation controls.

## Styles

The consumer provides all CSS styling. The component renders with a `.tour` class for targeting.

## Testing

- Verify the component renders a `<div>` element
- Verify `aria-label` is set from the `label` prop
- Verify children content is rendered
- Verify pass-through attributes are applied

## Advice

- **Designers**: Include progress indicators (e.g., step 2 of 5) and clear navigation controls (next, previous, skip). Highlight the relevant UI element for each step.
- **Developers**: Manage tour state (current step, completed steps) in the consumer. Use TourList and TourListItem for semantic structure.

## Composition

Tour is the parent container in the Tour pattern: Tour > TourList > TourListItem.

## References

- WAI-ARIA Practices: https://www.w3.org/WAI/ARIA/apg/
