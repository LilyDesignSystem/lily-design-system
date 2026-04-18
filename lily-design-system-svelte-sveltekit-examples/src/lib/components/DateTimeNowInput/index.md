# DateTimeNowInput

## Overview

A headless component that wraps a native <input type="date">, <input type="time">,
and <button type="button"> inside a <div>. The "Now" button sets both inputs to the
current local date and time when clicked. Useful for event logging, timestamping,
incident reporting, and any scenario where users need to quickly capture the current
date and time or manually enter a specific date and time.

## What it does

An input for entering a date and time and "now" button <input type="date"><input type="time"><button type="button">.

## When to use

- Use when you need the user to enter or pick a value in a form.

## When not to use

- Do not use for read-only display — use the matching `*View` component instead.

## Usage

```svelte
<DateTimeNowInput label="Event time" bind:dateValue bind:timeValue />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name for the wrapper group via aria-label. |
| `dateLabel` | string, default "Date" | Accessible name for the date input via aria-label. |
| `timeLabel` | string, default "Time" | Accessible name for the time input via aria-label. |
| `nowLabel` | string, default "Now" | Accessible label and text for the "Now" button. |
| `dateValue` | string, default "" | Bindable date string (format: YYYY-MM-DD). |
| `timeValue` | string, default "" | Bindable time string (format: HH:mm). |
| `required` | boolean, default false | Whether the inputs are required. |
| `disabled` | boolean, default false | Whether the inputs and button are disabled. |
| `...restProps` | additional HTML attributes spread onto the wrapper <div> |  |

## Examples

```svelte
<!-- Basic usage -->
<DateTimeNowInput label="Event time" bind:dateValue bind:timeValue />

<!-- Custom labels for internationalization -->
<DateTimeNowInput label="Heure" dateLabel="Date" timeLabel="Heure" nowLabel="Maintenant" bind:dateValue bind:timeValue />

<!-- Required and disabled -->
<DateTimeNowInput label="Appointment" bind:dateValue bind:timeValue required disabled={isLocked} />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import DateTimeNowInput from "$lib/components/DateTimeNowInput/DateTimeNowInput.svelte";
</script>

<DateTimeNowInput label="Event time" bind:dateValue bind:timeValue />
```

## Keyboard

- Tab: Moves focus between the date input, time input, and "Now" button
- Enter/Space on the "Now" button: Sets both inputs to the current date and time
- Arrow keys: Navigate within the date and time picker fields (native browser behavior)

## Accessibility

- role="group" on the wrapper with aria-label for grouping
- aria-label on the date input provides the accessible name
- aria-label on the time input provides the accessible name
- aria-label on the "Now" button describes its purpose

## Internationalization

- The label, dateLabel, timeLabel, and nowLabel props are the only user-facing strings
- Default labels are "Date", "Time", and "Now"; override for other locales
- No other hardcoded user-facing strings

## References

- MDN date input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date
- MDN time input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time
