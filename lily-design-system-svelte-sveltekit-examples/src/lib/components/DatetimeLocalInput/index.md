# DateTimeLocalInput

## Overview

A headless native datetime-local input wrapping <input type="datetime-local">
with accessible labelling via aria-label and a bindable value. The value follows
the format YYYY-MM-DDThh:mm, and the browser provides the native date-time picker
UI. Useful for scheduling interfaces, event creation forms, appointment booking,
and any scenario where both date and time must be captured in a single field.

## What it does

An input for entering a date and time without time zone <input type="datetime-local">.

## When to use

- Use when you need the user to enter or pick a value in a form.

## When not to use

- Do not use for read-only display — use the matching `*View` component instead.

## Usage

```svelte
<DateTimeLocalInput label="Event start" bind:value />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name applied via aria-label. |
| `value` | string, default "" | Bindable datetime string (format: YYYY-MM-DDThh:mm). |
| `min` | string, default undefined | Minimum allowed datetime. |
| `max` | string, default undefined | Maximum allowed datetime. |
| `required` | boolean, default false | Whether the input is required for form submission. |
| `disabled` | boolean, default false | Whether the input is disabled. |
| `...restProps` | additional HTML attributes spread onto the <input> |  |

## Examples

```svelte
<!-- Datetime input with min/max constraints -->
<DateTimeLocalInput label="Appointment" bind:value min="2024-01-01T08:00" max="2024-12-31T18:00" />
<!-- Required and conditionally disabled -->
<DateTimeLocalInput label="Departure time" bind:value required disabled={isLocked} />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import DateTimeLocalInput from "$lib/components/DateTimeLocalInput/DateTimeLocalInput.svelte";
</script>

<DateTimeLocalInput label="Event start" bind:value />
```

## Keyboard

- Tab: Move focus to and from the datetime input (native browser behavior)
- Arrow keys: Navigate within the datetime picker fields (native browser behavior)
- Enter: Open or confirm the datetime picker (native browser behavior)

## Accessibility

- aria-label provides an accessible name since there is no visible <label> element

## Internationalization

- The label prop provides the accessible name; no hardcoded strings

## References

- MDN datetime-local input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local
