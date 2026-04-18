# RedAmberGreenPicker

A RAG (Red/Amber/Green) status input is a UI/UX component that allows users to
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
- The `value` prop is `$bindable()` for two-way binding with `bind:value`
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

Basic RAG status selection:

```svelte
<script lang="ts">
  import RedAmberGreenPicker from './RedAmberGreenPicker.svelte';

  let status = $state("");
</script>

<RedAmberGreenPicker label="Project status" bind:value={status} />
<p>Current status: {status}</p>
```

Pre-selected value:

```svelte
<RedAmberGreenPicker label="Health check" value="green" />
```

With additional HTML attributes:

```svelte
<RedAmberGreenPicker
  label="Sprint status"
  bind:value={status}
  data-project="alpha"
/>
```

## Keyboard Interactions

- Arrow keys navigate options (native select behavior)
- Enter/Space opens the dropdown
- Escape closes the dropdown

## ARIA

- `aria-label` on the select from the label prop

## References

- RAG Status: https://en.wikipedia.org/wiki/Traffic_light_rating_system
