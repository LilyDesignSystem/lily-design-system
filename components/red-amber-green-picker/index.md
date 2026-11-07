# Red Amber Green Picker

A RAG (Red/Amber/Green) picker is a UI/UX component that allows users to
select a traffic-light status value from a group of radio buttons. RAG status is one of the
most widely used status indicators in project management, dashboards, and
reporting tools. Red indicates a critical problem that needs immediate
attention, amber signals caution or minor issues, and green means everything is
on track. The component renders as a group of native radios with appropriate
accessibility attributes, providing native keyboard navigation and screen
reader support. This headless component provides the semantic structure while
allowing consumers to apply their own visual styling.

**Status:** stable — exercised in composed page flows under e2e and axe, beyond the per-component checks.

## Implementation Notes

- Renders a `<fieldset role="radiogroup">` of three native radios, one per status: red, amber, green
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

- `red`: Critical problem, needs immediate attention
- `amber`: Caution, minor issues or at risk
- `green`: On track, everything is fine

## Usage

Project status, with the consumer's own words for each status:

```svelte
<script>
  const labels = { red: "Off track", amber: "At risk", green: "On track" };
  let status = $state("amber");
</script>

<RedAmberGreenPicker
  label="Project status"
  statusLabel={(s) => labels[s]}
  bind:value={status}
/>
```

It renders:

```html
<fieldset
  class="red-amber-green-picker"
  role="radiogroup"
  aria-label="Project status"
>
  <label
    ><input
      type="radio"
      name="status"
      value="red"
    />
    Off track</label
  >
  <label
    ><input
      type="radio"
      name="status"
      value="amber"
      checked
    />
    At risk</label
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

The RedAmberGreenPicker headless component renders a `<fieldset role="radiogroup">` of three native radios (red, amber, green), with each option's text from the consumer and two-way value binding. The native radio group supplies the keyboard behaviour. The consumer provides all visual styling, including colour coding.

## Styles

The consumer provides all CSS styling. The component renders with a `.red-amber-green-picker` class for targeting. No default styles are included — this is a fully headless component.

## Testing

- Verify the component renders a `<fieldset>` element with class `red-amber-green-picker` and `role="radiogroup"`
- Verify one native radio per status, sharing one name
- Verify each option's text comes from `statusLabel`, and nothing English is hardcoded
- Verify the arrow keys move and check the radios, and a form reset restores the starting value
- Verify pass-through attributes are applied

## Advice

- **Designers**: Color-code the options (red, amber, green) but also include text labels, as color alone is insufficient for users with color vision deficiencies.
- **Developers**: Initialize the `value` prop to a meaningful default rather than leaving it empty, so the status is always in a valid state.

## Composition

RedAmberGreenPicker renders its own radios. `red-amber-green-picker-button` is a separate part, for a consumer that composes its own group; it is not a child of this component.

## Related components

- `red-amber-green-picker-button` — a picker button for selecting a red/amber/green status

## References

- RAG Status: https://en.wikipedia.org/wiki/Traffic_light_rating_system

---

Lily™ and Lily Design System™ are trademarks.
