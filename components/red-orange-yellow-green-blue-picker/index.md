# Red Orange Yellow Green Blue Picker

A ROYGB (Red/Orange/Yellow/Green/Blue) picker is a UI/UX component that allows
users to select a five-level color-coded status value from a group of radio buttons. ROYGB
extends the traditional RAG (Red/Amber/Green) model by adding orange and blue
levels for more granular status reporting. Red indicates a critical problem,
orange signals a hazard or significant risk, yellow means caution or minor
issues, green indicates normal on-track status, and blue represents a paused or
informational state. The component renders as a group of native radios with appropriate
accessibility attributes, providing native keyboard navigation and screen reader
support. This headless component provides the semantic structure while allowing
consumers to apply their own visual styling.

**Status:** stable — exercised in composed page flows under e2e and axe, beyond the per-component checks.

## Implementation Notes

- Renders a `<fieldset role="radiogroup">` of five native radios, one per status: red, orange, yellow, green, blue
- Each option's text comes from the required `statusLabel(status)`: there is no English default
- The `value` prop is two-way binding, and a form reset restores the starting value
- Uses the native radio group's keyboard behaviour

## Props

- `label`: string (required) -- accessible name for the group
- `statusLabel`: (status: string) => string (required) -- each option's visible text
- `value`: string (default: "") -- the checked status, bindable
- `name`: string (default: "status") -- radio group name for form submission
- `disabled`: boolean (default: false) -- disables the whole group
- `...restProps`: Any additional HTML attributes spread onto the fieldset

## Options

- `red`: Critical problem
- `orange`: Hazard or significant risk
- `yellow`: Caution or minor issues
- `green`: Normal, on track
- `blue`: Paused or informational

## Usage

Risk level, with the consumer's own words for each status:

```svelte
<script>
  const labels = {
    red: "Severe",
    orange: "High",
    yellow: "Medium",
    green: "Low",
    blue: "Informational",
  };
  let status = $state("orange");
</script>

<RedOrangeYellowGreenBluePicker
  label="Risk level"
  statusLabel={(s) => labels[s]}
  bind:value={status}
/>
```

It renders:

```html
<fieldset
  class="red-orange-yellow-green-blue-picker"
  role="radiogroup"
  aria-label="Risk level"
>
  <label
    ><input
      type="radio"
      name="status"
      value="red"
    />
    Severe</label
  >
  <label
    ><input
      type="radio"
      name="status"
      value="orange"
      checked
    />
    High</label
  >
  …
</fieldset>
```

## Keyboard Interactions

- Tab: focus the checked radio, or the first if none is checked
- ArrowDown / ArrowRight: move to and check the next radio
- ArrowUp / ArrowLeft: move to and check the previous radio
- Space: check the focused radio

## ARIA

- `role="radiogroup"` on the `<fieldset>`, named by `aria-label`
- Each radio is named by its visible text, so a status is never colour alone

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

The RedOrangeYellowGreenBluePicker headless component renders a `<fieldset role="radiogroup">` of five native radios (red, orange, yellow, green, blue), with each option's text from the consumer and two-way value binding. The native radio group supplies the keyboard behaviour. The consumer provides all visual styling, including colour coding.

## Styles

The consumer provides all CSS styling. The component renders with a `.red-orange-yellow-green-blue-picker` class for targeting. No default styles are included — this is a fully headless component.

## Testing

- Verify the component renders a `<fieldset>` element with class `red-orange-yellow-green-blue-picker` and `role="radiogroup"`
- Verify one native radio per status, sharing one name
- Verify each option's text comes from `statusLabel`, and nothing English is hardcoded
- Verify the arrow keys move and check the radios, and a form reset restores the starting value
- Verify pass-through attributes are applied

## Advice

- **Designers**: Assign distinct, accessible colors to each of the five levels and always include text labels since five color-only indicators are harder to distinguish.
- **Developers**: Initialize the `value` prop to a valid default, and consider providing a placeholder option if no initial status is appropriate.

## Composition

RedOrangeYellowGreenBluePicker renders its own radios. `red-orange-yellow-green-blue-picker-button` is a separate part, for a consumer that composes its own group; it is not a child of this component.

## Related components

- `red-orange-yellow-green-blue-picker-button` — a picker button for selecting a five-level color status

## References

- Traffic Light Rating System: https://en.wikipedia.org/wiki/Traffic_light_rating_system

---

Lily™ and Lily Design System™ are trademarks.
