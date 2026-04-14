# Tour List Item

A single step within a TourGuideList guided tour. Each step represents one screen or instruction in the tour sequence. The step conditionally shows or hides based on the `current` prop, using the `hidden` attribute and `aria-hidden` for proper accessibility. Step progress information is communicated to screen readers through the accessible label.

This component is designed to be placed inside a TourGuideList container. The consumer controls which step is current via the `current` prop, enabling flexible navigation patterns (next/previous buttons, step indicators, etc.).

## Help

Use TourListItem for each individual step in a TourGuideList walkthrough. Common scenarios include onboarding step content, feature highlight descriptions, and tutorial instructions. The parent TourGuideList manages the dialog overlay while each TourListItem manages its own visibility.

## Syntax

```html
<TourListItem label="..." current={...}>
  <!-- step content -->
</TourListItem>
```

## Usage

```html
<TourList label="Feature tour" active={showTour}>
  <TourListItem label="Search patients" current={step === 0} stepNumber={1} totalSteps={2}>
    <p>Type a patient name or NHS number into the search bar to find their record.</p>
    <button onclick={() => step++}>Next</button>
  </TourListItem>
  <TourListItem label="View results" current={step === 1} stepNumber={2} totalSteps={2}>
    <p>Click a result to open the full patient record.</p>
    <button onclick={() => step--}>Back</button>
    <button onclick={() => showTour = false}>Done</button>
  </TourListItem>
</TourList>
```

## Props

| Prop           | Type            | Default    | Description                                             |
| -------------- | --------------- | ---------- | ------------------------------------------------------- |
| `label`        | `string`        | (required) | Accessible name for this step via `aria-label`          |
| `current`      | `boolean`       | `false`    | Whether this step is the currently visible step         |
| `stepNumber`   | `number`        | (optional) | 1-based step number (e.g. 1, 2, 3)                      |
| `totalSteps`   | `number`        | (optional) | Total number of steps in the tour                       |
| `children`     | `slot`       | (required) | Step content                                            |
| `...restProps` | HTML attributes |            | Additional attributes spread onto the container `<div>` |

## Examples

Multi-step tour:

```html
<TourGuideList label="Getting started" active={active}>
  <TourListItem label="Welcome" current={step === 0} stepNumber={1} totalSteps={3}>
    <p>Welcome to the app!</p>
    <button onclick={() => step++}>Next</button>
  </TourListItem>
  <TourListItem label="Features" current={step === 1} stepNumber={2} totalSteps={3}>
    <p>Here are the features.</p>
    <button onclick={() => step--}>Back</button>
    <button onclick={() => step++}>Next</button>
  </TourListItem>
  <TourListItem label="Finish" current={step === 2} stepNumber={3} totalSteps={3}>
    <p>You're all set!</p>
    <button onclick={() => active = false}>Done</button>
  </TourListItem>
</TourGuideList>
```

## Keyboard Interactions

- None directly -- keyboard interactions are managed by the parent TourGuideList and by interactive elements within step content

## ARIA

- `role="group"` -- groups the step content semantically
- `aria-roledescription="step"` -- identifies the element as a tour step
- `aria-label` -- provides an accessible name, optionally including "Step N of M"
- `aria-current="step"` -- indicates the currently active step
- `aria-hidden="true"` -- hides inactive steps from assistive technology
- `hidden` -- hides inactive steps from visual rendering
## When to Use

- Use inside TourList to represent one step in the guided tour.
- Use when each step needs independent visibility control and step progress information.
- Use with `stepNumber` and `totalSteps` props for accessible progress labels.

## When Not to Use

- Do not use outside TourList -- use TimelineListItem or ContentsListItem for other list patterns.
- Do not use for static content sections -- use AccordionListItem or ContentsListItem instead.

## Headless

This headless component provides a `<div>` with `role="group"`, `aria-roledescription="step"`, `aria-label` (with optional step progress), `aria-current`, and `hidden`/`aria-hidden` for conditional visibility. The consumer provides all step content, navigation buttons, and all visual styling.


## Styles

The consumer provides all CSS styling. The component renders with a `.tour-list-item` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<li>` element with class `tour-list-item`
- Verify role="group"` -- groups the step content semantically
- Verify aria-label` -- provides an accessible name, optionally including "Step N of M"
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Make the current step visually prominent and clearly indicate progress (e.g., step dots, "Step N of M" text) so users know where they are in the tour.
- **Developers**: Provide `stepNumber` and `totalSteps` props for accessible step progress labels. Use the `current` prop to control which step is visible.

## Composition

TourListItem is a child of TourGuideList, following the Guide/GuideList/GuideListItem pattern. The parent TourGuideList provides the modal dialog overlay, and each TourListItem manages its own visibility based on the `current` prop.

## References

- WAI-ARIA Group Role: https://www.w3.org/TR/wai-aria-1.2/#group
- WAI-ARIA aria-roledescription: https://www.w3.org/TR/wai-aria-1.2/#aria-roledescription
- WAI-ARIA aria-current: https://www.w3.org/TR/wai-aria-1.2/#aria-current
