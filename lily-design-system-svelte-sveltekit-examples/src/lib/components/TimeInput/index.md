# TimeInput

## Overview

A headless time input using the native HTML <input type="time"> element.
Renders a time picker control appropriate to the user's browser and OS,
allowing users to enter hours and minutes in a localized format. Commonly
used for scheduling interfaces, appointment forms, event planners, and any
form requiring time-of-day entry. The value uses HH:MM format (24-hour).

## What it does

An input for entering a time value <input type="time">.

## When to use

- Use when you need the user to enter or pick a value in a form.

## When not to use

- Do not use for read-only display — use the matching `*View` component instead.

## Usage

```svelte
<TimeInput label="Start time" bind:value />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name via aria-label. |
| `value` | string, default "" | Bindable time value in HH:MM format; supports bind:value. |
| `required` | boolean, default false | Whether the field is required. |
| `disabled` | boolean, default false | Whether the field is disabled. |
| `...restProps` | additional HTML attributes spread onto the <input> |  |

## Examples

```svelte
<!-- Time input with min/max constraints -->
<TimeInput label="Deadline" bind:value={deadline} min="09:00" max="17:00" />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import TimeInput from "$lib/components/TimeInput/TimeInput.svelte";
</script>

<TimeInput label="Start time" bind:value />
```

## Keyboard

- Arrow keys: adjust hours/minutes, Tab between segments (native behavior)

## Accessibility

- aria-label={label} provides an accessible name since no visible <label> is included

## Internationalization

- The label prop accepts any translated string
- No hardcoded user-facing strings

## References

- MDN input type="time": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time
