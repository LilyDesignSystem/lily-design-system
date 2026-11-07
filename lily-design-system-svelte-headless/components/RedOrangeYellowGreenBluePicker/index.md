# RedOrangeYellowGreenBluePicker

A picker for selecting a five-level color status.

A `<fieldset role="radiogroup">` of 5 native radios (red, orange, yellow, green, blue) sharing one `name`, as `five-star-rating-picker` is: the radios give the keys (the arrows move and check, Space checks), form submission and form reset. Each option's visible text is the consumer's, through the required status label: there is no English default, and without it an option shows its value.

See [components/red-orange-yellow-green-blue-picker/index.md](../../../components/red-orange-yellow-green-blue-picker/index.md) for the cross-framework documentation.

## Props

- `class` (string, optional) - CSS class appended after the base `red-orange-yellow-green-blue-picker` class.
- `label` (string, required) - Accessible name, via `aria-label`.
- `statusLabel` ((status: string) => string, required) - Each option's visible text.
- `value` (string, default `""`) - The checked status. Bindable via `bind:value`.
- `name` (string, default `"status"`) - Radio group name for form submission.
- `disabled` (boolean, default `false`) - Disables the whole group.
- `...restProps` - Spread onto the fieldset.

## Usage

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

---

Lily™ and Lily Design System™ are trademarks.
