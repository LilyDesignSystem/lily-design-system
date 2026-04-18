# DateInput

## Overview

A headless native date input wrapping <input type="date"> with accessible
labelling via aria-label and a bindable value. The value is stored in ISO 8601
YYYY-MM-DD format. It supports min and max constraints to restrict the allowable
date range. Useful in forms where users need to enter a calendar date with the
browser's built-in date picker.

## What it does

An input for entering a date value <input type="date">.

## When to use

- Use when you need the user to enter or pick a value in a form.

## When not to use

- Do not use for read-only display — use the matching `*View` component instead.

## Usage

```svelte
<DateInput label="Birth date" bind:value />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name applied via aria-label. |
| `value` | string, default "" | Bindable date string in YYYY-MM-DD format. |
| `min` | string, default undefined | Minimum allowed date in YYYY-MM-DD format. |
| `max` | string, default undefined | Maximum allowed date in YYYY-MM-DD format. |
| `required` | boolean, default false | Whether the input is required for form submission. |
| `disabled` | boolean, default false | Whether the input is disabled. |
| `...restProps` | additional HTML attributes spread onto the <input> |  |

## Examples

```svelte
<!-- Date input with min/max constraints -->
<DateInput label="Deadline" bind:value min="2024-01-01" max="2024-12-31" />
<!-- Required and conditionally disabled -->
<DateInput label="Start date" bind:value required disabled={isLocked} />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import DateInput from "$lib/components/DateInput/DateInput.svelte";
</script>

<DateInput label="Birth date" bind:value />
```

## Keyboard

- Tab: Move focus to and from the date input (native browser behavior)
- Arrow keys: Navigate within the date picker fields (native browser behavior)
- Enter: Open or confirm the date picker (native browser behavior)

## Accessibility

- aria-label provides an accessible name since there is no visible <label> element

## Internationalization

- The label prop provides the accessible name; no hardcoded strings

## References

- MDN date input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date
