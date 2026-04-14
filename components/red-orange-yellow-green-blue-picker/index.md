# Red Orange Yellow Green Blue Picker

A ROYGB (Red/Orange/Yellow/Green/Blue) picker is a UI/UX component that allows
users to select a five-level color-coded status value from a dropdown. ROYGB
extends the traditional RAG (Red/Amber/Green) model by adding orange and blue
levels for more granular status reporting. Red indicates a critical problem,
orange signals a hazard or significant risk, yellow means caution or minor
issues, green indicates normal on-track status, and blue represents a paused or
informational state. The component renders as a select element with appropriate
accessibility attributes, providing native keyboard navigation and screen reader
support. This headless component provides the semantic structure while allowing
consumers to apply their own visual styling.

## Implementation Notes

- Renders as `<select aria-label={label}>` with five options: red, orange, yellow, green, blue
- The `value` prop is two-way binding
- Uses native select keyboard navigation

## Props

- `label`: string (required) -- accessible label for the select
- `value`: string (default: "") -- currently selected status, bindable
- `...restProps`: Any additional HTML attributes spread onto the select

## Options

- `red`: Critical problem
- `orange`: Hazard or significant risk
- `yellow`: Caution or minor issues
- `green`: Normal, on track
- `blue`: Paused or informational

## Usage

Risk matrix with five-level granularity:

```html
<Field label="Clinical risk assessment" required>
  <RedOrangeYellowGreenBluePicker label="Clinical risk level">
    <RedOrangeYellowGreenBluePickerButton value="red" label="Red - Critical" onclick={handleSelect} />
    <RedOrangeYellowGreenBluePickerButton value="orange" label="Orange - Serious" onclick={handleSelect} />
    <RedOrangeYellowGreenBluePickerButton value="yellow" label="Yellow - Caution" selected onclick={handleSelect} />
    <RedOrangeYellowGreenBluePickerButton value="green" label="Green - Good" onclick={handleSelect} />
    <RedOrangeYellowGreenBluePickerButton value="blue" label="Blue - Excellent" onclick={handleSelect} />
  </RedOrangeYellowGreenBluePicker>
</Field>
```

Detailed project health assessment:

```html
<RedOrangeYellowGreenBluePicker label="Project health" data-dashboard="main">
  <RedOrangeYellowGreenBluePickerButton value="red" label="Red - Blocked" onclick={handleSelect} />
  <RedOrangeYellowGreenBluePickerButton value="orange" label="Orange - Major risks" onclick={handleSelect} />
  <RedOrangeYellowGreenBluePickerButton value="yellow" label="Yellow - Minor risks" onclick={handleSelect} />
  <RedOrangeYellowGreenBluePickerButton value="green" label="Green - On track" selected onclick={handleSelect} />
  <RedOrangeYellowGreenBluePickerButton value="blue" label="Blue - Ahead of schedule" onclick={handleSelect} />
</RedOrangeYellowGreenBluePicker>
```

## Keyboard Interactions

- Arrow keys navigate options (native select behavior)
- Enter/Space opens the dropdown
- Escape closes the dropdown

## ARIA

- `aria-label` on the select from the label prop

## When to Use

- Use for selecting a five-level colour status extending the traditional RAG pattern with additional granularity.
- Use in risk matrices where distinguishing between critical, serious, and cautionary levels matters.
- Use in detailed health assessments that need more than three status tiers.
- Use in project tracking dashboards where five levels capture the full range of progress states.

## When Not to Use

- Do not use for display-only status -- use [RedOrangeYellowGreenBlueView](../red-orange-yellow-green-blue-view/) instead.
- Do not use when a simpler three-level scale suffices -- use [RedAmberGreenPicker](../red-amber-green-picker/) instead.
- Do not use for binary on/off states -- use [SwitchButton](../switch-button/) or [CheckboxInput](../checkbox-input/) instead.

## Headless

The RedOrangeYellowGreenBluePicker headless component provides a `<select>` with `aria-label` and five predefined options (red, orange, yellow, green, blue) with two-way value binding. Native select keyboard navigation is fully supported. The consumer provides all visual styling, including color coding.


## Styles

The consumer provides all CSS styling. The component renders with a `.red-orange-yellow-green-blue-picker` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `red-orange-yellow-green-blue-picker`
- Verify aria-label` on the select from the label prop
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Assign distinct, accessible colors to each of the five levels and always include text labels since five color-only indicators are harder to distinguish.
- **Developers**: Initialize the `value` prop to a valid default, and consider providing a placeholder option if no initial status is appropriate.

## Composition

RedOrangeYellowGreenBluePicker is the container for RedOrangeYellowGreenBluePickerButton children. Use `<RedOrangeYellowGreenBluePicker>` to wrap `<RedOrangeYellowGreenBluePickerButton>` elements, where each button represents one of the five status levels with `aria-pressed` toggle state.

## References

- Traffic Light Rating System: https://en.wikipedia.org/wiki/Traffic_light_rating_system
