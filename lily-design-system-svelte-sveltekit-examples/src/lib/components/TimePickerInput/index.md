# TimePickerInput

## Overview

A headless time picker that wraps a native <input type="time"> element,
allowing users to select a specific time of day. Often used alongside date
pickers in forms, scheduling tools, or booking systems. The native input
handles 12-hour/24-hour format based on the browser locale. Supports
two-way data binding and standard form validation attributes.

## What it does

An input with a dropdown for picking a time.

## When to use

- Use when you need the user to enter or pick a value in a form.

## When not to use

- Do not use for read-only display — use the matching `*View` component instead.

## Usage

```svelte
<TimePickerInput label="Appointment time" bind:value />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name via aria-label. |
| `value` | string, default "" | Current time value in HH:MM format; bindable with bind:value. |
| `required` | boolean, default false | Whether a value is required for form submission. |
| `disabled` | boolean, default false | Whether the input is disabled. |
| `...restProps` | additional HTML attributes spread onto the <input> |  |

## Examples

```svelte
<!-- Required departure time picker -->
<TimePickerInput label="Departure time" bind:value required />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import TimePickerInput from "$lib/components/TimePickerInput/TimePickerInput.svelte";
</script>

<TimePickerInput label="Appointment time" bind:value />
```

## Keyboard

- Tab: move focus to/from the time input
- ArrowUp/ArrowDown: increment/decrement the focused time segment
- ArrowLeft/ArrowRight: move between time segments

## Accessibility

- aria-label={label} provides an accessible name for the time input

## Internationalization

- The label prop accepts any translated string
- Time format is locale-dependent via native browser behavior

## References

- MDN input type="time": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time
