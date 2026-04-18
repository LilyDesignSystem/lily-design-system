# RedAmberGreenPicker

## Overview

A headless RAG (Red/Amber/Green) status input that renders a native
<select> element with three traffic-light options: red, amber, and green.
RAG status is widely used in project management dashboards, risk registers,
and reporting tools to communicate health at a glance.

## What it does

A picker for selecting a red/amber/green status.

## When to use

- Use when the user should choose from a bounded set of visual options.

## When not to use

- Do not use when a simple `<Select>` or radio group would communicate options better.

## Usage

```svelte
<RedAmberGreenPicker label="Project status" bind:value={status} />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible label for the select element. |
| `value` | string, default "" | Currently selected status value; bindable. |
| `...restProps` | additional HTML attributes spread onto the <select> |  |

## Examples

```svelte
<!-- Pre-selected value -->
<RedAmberGreenPicker label="Health check" value="green" />

<!-- Two-way binding with state -->
<RedAmberGreenPicker label="Sprint status" bind:value={status} data-project="alpha" />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import RedAmberGreenPicker from "$lib/components/RedAmberGreenPicker/RedAmberGreenPicker.svelte";
</script>

<RedAmberGreenPicker label="Project status" bind:value={status} />
```

## Keyboard

- Arrow Up/Down: navigate options (native select behavior)
- Enter/Space: open the dropdown (native select behavior)
- Escape: close the dropdown (native select behavior)

## Accessibility

- aria-label on the <select> for screen reader context
- Native <select> provides implicit combobox/listbox role
- WCAG 2.2 AAA: properly labeled for assistive technology

## Internationalization

- The label prop externalizes the accessible label string
- Option display text ("Red", "Amber", "Green") is hardcoded; wrap or fork to localize

## References

- Traffic Light Rating System: https://en.wikipedia.org/wiki/Traffic_light_rating_system
