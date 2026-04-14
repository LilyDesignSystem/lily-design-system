# Expander

An expander shows or hides additional content with a toggle button control. It is similar to a native `<details>`/`<summary>` disclosure element but uses a `<button>` trigger with `aria-expanded` for full control over behavior and presentation.

This component is useful for progressive disclosure patterns such as FAQ sections, collapsible panels, settings groups, or any interface where content should be hidden by default and revealed on demand. The expanded state is bindable, allowing parent components to programmatically control visibility.

## Implementation Notes

- Renders a `<div>` wrapper containing a `<button>` toggle and a conditional content region
- The button uses `aria-expanded` and `aria-controls` to communicate state to assistive technologies
- The content region uses `role="region"` with `aria-label` matching the button label
- A unique `contentId` is generated using `Math.random()` for the `aria-controls`/`id` link
- Supports two-way binding on the `expanded` prop
- Content is conditionally rendered with conditional rendering, removing it from the DOM when collapsed
- Uses slot for the `children` prop

## Props

- `label`: string (required) -- button text and accessible name for both the button and the content region
- `expanded`: boolean (default: false) -- bindable boolean controlling whether the content is visible
- `children`: slot (required) -- expandable content rendered when expanded is true
- `...restProps`: unknown -- additional attributes spread onto the outer `<div>` wrapper

## Usage

```html
<Expander summary="How to get your medical records">
  <p>You can see your GP records by:</p>
  <ul>
    <li>asking for them at your GP surgery</li>
    <li>going online to see them if you have signed up for GP online services</li>
  </ul>
</Expander>

<Expander summary="How to measure your blood glucose levels">
  <p>Testing your blood glucose levels involves a simple finger prick test
  using a blood glucose monitor.</p>
</Expander>
```

```html
<Expander label="Advanced settings" expanded={showAdvanced}>
  <form>...</form>
</Expander>
```

## Keyboard Interactions

- Enter: Toggles the expander open/closed when the button has focus (native button behavior)
- Space: Toggles the expander open/closed when the button has focus (native button behavior)
- Tab: Moves focus to/from the toggle button

## ARIA

- `aria-expanded={expanded}` -- on the button, indicates whether the controlled content is currently visible
- `aria-controls={contentId}` -- on the button, references the id of the expandable content region
- `role="region"` -- on the content container, identifies the expandable area as a landmark region
- `aria-label={label}` -- on the content region, provides an accessible name for the region

## When to Use

- Use to break complex, information-dense pages into expandable sections that users can open on demand.
- Use when the expandable content is relevant to a wide audience, not just a niche group.
- Use when multiple expanders on one page help users find the specific topic they need.
- Use only after testing whether the content works without an expander -- consider simplifying, splitting, or restructuring first.
- Use when you need full control over the toggle button behavior and styling beyond what native `<details>` provides.

## When Not to Use

- Do not use when only some users need the information -- use Details for supplementary content aimed at a subset of users.
- Do not use for help text within forms -- use Hint or Details instead.
- Do not use on pages with other interactive elements like form inputs -- expanders may distract from the primary task.
- Do not use inside other patterns such as CareCard or WarningCallout.

## Headless

This headless component provides a `<div>` wrapper with a `<button>` toggle using `aria-expanded` and `aria-controls`, a conditionally rendered content `<div>` with `role="region"`, and two-way binding on the `expanded` prop. The consumer provides all visual styling for the button, expanded content area, and any transition animations.


## Styles

The consumer provides all CSS styling. The component renders with a `.expander` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `expander`
- Verify role="region"` -- on the content container, identifies the expandable area as a landmark region
- Verify aria-label={label}` -- on the content region, provides an accessible name for the region
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Use a visual indicator (such as a chevron or plus/minus icon) on the toggle button to communicate expandability. Animate the expand/collapse transition for a polished feel.
- **Developers**: The content region is removed from the DOM when collapsed, so any stateful children will reset. Use the bindable `expanded` prop to coordinate with parent component logic.

## References

- WAI-ARIA Disclosure Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/disclosure/
