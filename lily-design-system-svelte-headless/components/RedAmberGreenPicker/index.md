# RedAmberGreenPicker

A picker for selecting a red/amber/green status.

A `<fieldset role="radiogroup">` of 3 native radios (red, amber, green) sharing one `name`, as `five-star-rating-picker` is: the radios give the keys (the arrows move and check, Space checks), form submission and form reset. Each option's visible text is the consumer's, through the required status label: there is no English default, and without it an option shows its value.

See [components/red-amber-green-picker/index.md](../../../components/red-amber-green-picker/index.md) for the cross-framework documentation.

## Props

- `class` (string, optional) - CSS class appended after the base `red-amber-green-picker` class.
- `label` (string, required) - Accessible name, via `aria-label`.
- `statusLabel` ((status: string) => string, required) - Each option's visible text.
- `value` (string, default `""`) - The checked status. Bindable via `bind:value`.
- `name` (string, default `"status"`) - Radio group name for form submission.
- `disabled` (boolean, default `false`) - Disables the whole group.
- `...restProps` - Spread onto the fieldset.

## Usage

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

---

Lily™ and Lily Design System™ are trademarks.
