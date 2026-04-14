# Tour List

TourList is a headless guided walkthrough overlay that presents step-by-step instructions to users. It renders as a modal dialog when active and can be dismissed with the Escape key, providing a structured onboarding or feature discovery experience.

This component is useful for onboarding flows, feature tutorials, or contextual help systems. The `active` prop is bindable, allowing the consumer to programmatically start or stop the tour. Step content, navigation buttons, and progress indicators are provided by the consumer as children.

## Help

Use TourList when you need to walk users through a sequence of steps in a modal overlay. Common scenarios include onboarding flows, feature discovery tours, and contextual help walkthroughs. Pair with TourListItem for individual steps.

## Syntax

```html
<TourList label="..." active={active}>
  <!-- TourListItem children -->
</TourList>
```

## Usage

```html
<Tour label="Onboarding">
  <TourList label="Getting started guide" active={showTour}>
    <TourListItem label="Dashboard overview" current={step === 0} stepNumber={1} totalSteps={3}>
      <p>This is your dashboard. It shows recent activity and key metrics.</p>
      <button onclick={() => step++}>Next</button>
      <button onclick={() => showTour = false}>Skip</button>
    </TourListItem>
    <TourListItem label="Navigation" current={step === 1} stepNumber={2} totalSteps={3}>
      <p>Use the sidebar to navigate between patients, appointments, and reports.</p>
      <button onclick={() => step--}>Back</button>
      <button onclick={() => step++}>Next</button>
    </TourListItem>
    <TourListItem label="Quick actions" current={step === 2} stepNumber={3} totalSteps={3}>
      <p>Use the task bar at the top for common actions like booking appointments.</p>
      <button onclick={() => step--}>Back</button>
      <button onclick={() => showTour = false}>Finish</button>
    </TourListItem>
  </TourList>
</Tour>
```

## Props

| Prop           | Type            | Default    | Description                                                        |
| -------------- | --------------- | ---------- | ------------------------------------------------------------------ |
| `label`        | `string`        | (required) | Accessible name for the tour dialog via `aria-label`               |
| `active`       | `boolean`       | `false`    | Whether the tour is currently visible; bindable with two-way `active` binding |
| `children`     | `slot`       | (required) | Tour step content, navigation controls, and any additional UI      |
| `...restProps` | HTML attributes |            | Additional attributes spread onto the dialog `<div>`               |

## Examples

With step management:

```html
<button onclick={() => { active = true; step = 0; }}>Start tour</button>

<TourList label="App walkthrough" active={active}>
  <TourListItem label="Step one" current={step === 0} stepNumber={1} totalSteps={2}>
    <p>First step content</p>
    <button onclick={() => step++}>Next</button>
  </TourListItem>
  <TourListItem label="Step two" current={step === 1} stepNumber={2} totalSteps={2}>
    <p>Second step content</p>
    <button onclick={() => active = false}>Finish</button>
  </TourListItem>
</TourList>
```

## Keyboard Interactions

- Escape: Closes the tour by setting `active` to false

## ARIA

- `role="dialog"` -- identifies the tour overlay as a dialog window
- `aria-modal="true"` -- indicates the dialog is modal and content behind it is inert
- `aria-label={label}` -- provides an accessible name describing the tour
- `tabindex="-1"` -- allows the dialog element to receive focus for keyboard event handling
## When to Use

- Use inside Tour to provide the ordered list of tour steps.
- Use when guidance needs to appear as a modal overlay that focuses user attention on one step at a time.
- Use with TourListItem children to define each individual step with progress information.

## When Not to Use

- Do not use outside Tour -- use ContentsList or TimelineList for other ordered lists.
- Do not use for simple tooltips or hints -- use Tooltip or InformationCallout instead.
- Do not use when users need to interact with the page while reading instructions -- consider a non-modal approach.

## Headless

This headless component provides a modal `<div>` with `role="dialog"`, `aria-modal="true"`, `aria-label`, and Escape key dismissal. The consumer provides all step content, navigation buttons, progress indicators, and all visual styling including backdrop, positioning, and animations.


## Styles

The consumer provides all CSS styling. The component renders with a `.tour-list` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<ol>` element with class `tour-list`
- Verify role="dialog"` -- identifies the tour overlay as a dialog window
- Verify aria-label={label}` -- provides an accessible name describing the tour
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Include clear step progress indicators (e.g., "Step 2 of 5") and provide both "Next" and "Skip" options so users are not forced through the entire tour.
- **Developers**: Manage step state externally and pass it to TourListItem children via the `current` prop. Trap focus within the dialog while active.

## Composition

TourList contains TourListItem children following the Guide/GuideList/GuideListItem pattern. TourList provides the modal dialog overlay, and each TourListItem provides one step with conditional visibility based on the `current` prop.

## References

- WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
