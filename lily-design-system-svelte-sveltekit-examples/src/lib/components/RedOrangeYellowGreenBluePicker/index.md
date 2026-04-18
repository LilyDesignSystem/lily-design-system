# RedOrangeYellowGreenBluePicker

## Overview

A headless ROYGB (Red/Orange/Yellow/Green/Blue) status input that renders
a native <select> element with five color-coded status options. Extends the
traditional RAG model with additional orange and blue levels for more granular
status reporting in risk registers, dashboards, and multi-tier alert systems.

## What it does

A picker for selecting a five-level color status.

## When to use

- Use when the user should choose from a bounded set of visual options.

## When not to use

- Do not use when a simple `<Select>` or radio group would communicate options better.

## Usage

```svelte
<RedOrangeYellowGreenBluePicker label="Risk level" bind:value={level} />
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
<RedOrangeYellowGreenBluePicker label="Alert status" value="green" />

<!-- Two-way binding with extra attributes -->
<RedOrangeYellowGreenBluePicker label="Project health" bind:value={level} data-dashboard="main" />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import RedOrangeYellowGreenBluePicker from "$lib/components/RedOrangeYellowGreenBluePicker/RedOrangeYellowGreenBluePicker.svelte";
</script>

<RedOrangeYellowGreenBluePicker label="Risk level" bind:value={level} />
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
- Option display text ("Red", "Orange", etc.) is hardcoded; wrap or fork to localize

## References

- Traffic Light Rating System: https://en.wikipedia.org/wiki/Traffic_light_rating_system
