# Red Amber Green Picker

A RAG (Red/Amber/Green) picker is a UI/UX component that allows users to
select a traffic-light status value from a dropdown. RAG status is one of the
most widely used status indicators in project management, dashboards, and
reporting tools. Red indicates a critical problem that needs immediate
attention, amber signals caution or minor issues, and green means everything is
on track. The component renders as a select element with appropriate
accessibility attributes, providing native keyboard navigation and screen
reader support. This headless component provides the semantic structure while
allowing consumers to apply their own visual styling.

## Implementation Notes

- Renders as `<select aria-label={label}>` with three options: red, amber, green
- The `value` prop is two-way binding
- Uses native select keyboard navigation

## Props

- `label`: string (required) -- accessible label for the select
- `value`: string (default: "") -- currently selected status, bindable
- `...restProps`: Any additional HTML attributes spread onto the select

## Options

- `red`: Critical problem, needs immediate attention
- `amber`: Caution, minor issues or at risk
- `green`: On track, everything is fine

## Usage

Risk assessment in a project dashboard:

```html
<form>
  <fieldset>
    <legend>Sprint 14 Status</legend>
    <RedAmberGreenPicker label="Overall sprint health">
      <RedAmberGreenPickerButton value="red" label="Red - Critical" onclick={handleSelect} />
      <RedAmberGreenPickerButton value="amber" label="Amber - At risk" selected onclick={handleSelect} />
      <RedAmberGreenPickerButton value="green" label="Green - On track" onclick={handleSelect} />
    </RedAmberGreenPicker>
  </fieldset>
</form>
```

Compliance tracking with pre-selected status:

```html
<RedAmberGreenPicker label="GDPR compliance status">
  <RedAmberGreenPickerButton value="red" label="Red - Non-compliant" onclick={handleSelect} />
  <RedAmberGreenPickerButton value="amber" label="Amber - Partial" onclick={handleSelect} />
  <RedAmberGreenPickerButton value="green" label="Green - Compliant" selected onclick={handleSelect} />
</RedAmberGreenPicker>
```

Health dashboard with data attributes:

```html
<RedAmberGreenPicker label="Patient alert level" data-patient-id="P-1042">
  <RedAmberGreenPickerButton value="red" label="Red - Immediate attention" onclick={handleSelect} />
  <RedAmberGreenPickerButton value="amber" label="Amber - Monitor closely" selected onclick={handleSelect} />
  <RedAmberGreenPickerButton value="green" label="Green - Stable" onclick={handleSelect} />
</RedAmberGreenPicker>
```

## Keyboard Interactions

- Arrow keys navigate options (native select behavior)
- Enter/Space opens the dropdown
- Escape closes the dropdown

## ARIA

- `aria-label` on the select from the label prop

## When to Use

- Use for selecting a traffic-light status (red/amber/green) in risk assessments and project trackers.
- Use in compliance tracking dashboards where items need a three-level severity rating.
- Use in health dashboards where a simple status indicator captures the current state.
- Use when a three-level severity or progress indicator is sufficient for the use case.
- Use when users need to set or change a RAG status interactively.

## When Not to Use

- Do not use for display-only status -- use [RedAmberGreenView](../red-amber-green-view/) instead.
- Do not use when five-level granularity is needed -- use [RedOrangeYellowGreenBluePicker](../red-orange-yellow-green-blue-picker/) instead.
- Do not use for binary on/off states -- use [SwitchButton](../switch-button/) or [CheckboxInput](../checkbox-input/) instead.
- Do not use for free-form status text -- use [Select](../select/) with custom options instead.

## Headless

The RedAmberGreenPicker headless component provides a `<select>` with `aria-label` and three predefined options (red, amber, green) with two-way value binding. Native select keyboard navigation is fully supported. The consumer provides all visual styling, including color coding.


## Styles

The consumer provides all CSS styling. The component renders with a `.red-amber-green-picker` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `red-amber-green-picker`
- Verify aria-label` on the select from the label prop
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Color-code the options (red, amber, green) but also include text labels, as color alone is insufficient for users with color vision deficiencies.
- **Developers**: Initialize the `value` prop to a meaningful default rather than leaving it empty, so the status is always in a valid state.

## Composition

RedAmberGreenPicker is the container for RedAmberGreenPickerButton children. Use `<RedAmberGreenPicker>` to wrap `<RedAmberGreenPickerButton>` elements, where each button represents one RAG status level with `aria-pressed` toggle state.

## References

- RAG Status: https://en.wikipedia.org/wiki/Traffic_light_rating_system
