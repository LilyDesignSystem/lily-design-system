# WeekInput

## Overview

A headless week input using the native HTML <input type="week"> element.
Renders a week picker control for selecting a specific week of the year,
with values in ISO 8601 YYYY-Www format (e.g., "2024-W01"). Useful for
scheduling applications, time tracking systems, reporting tools, and any
scenario where data is organized by week rather than by specific date.

## What it does

An input for selecting a week and year <input type="week">.

## When to use

- Use when you need the user to enter or pick a value in a form.

## When not to use

- Do not use for read-only display — use the matching `*View` component instead.

## Usage

```svelte
<WeekInput label="Select week" bind:value />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name via aria-label. |
| `value` | string, default "" | Bindable week value in YYYY-Www format; supports bind:value. |
| `required` | boolean, default false | Whether the field is required. |
| `disabled` | boolean, default false | Whether the field is disabled. |
| `...restProps` | additional HTML attributes spread onto the <input> |  |

## Examples

```svelte
<!-- Required report week selector -->
<WeekInput label="Report week" bind:value={selectedWeek} required />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import WeekInput from "$lib/components/WeekInput/WeekInput.svelte";
</script>

<WeekInput label="Select week" bind:value />
```

## Keyboard

- ArrowUp/ArrowDown: adjust the focused segment (year or week number)
- ArrowLeft/ArrowRight: move between year and week segments
- Enter: confirm selection (native behavior, varies by browser)

## Accessibility

- aria-label={label} provides the accessible name since no visible label is associated

## Internationalization

- The label prop accepts any translated string
- No hardcoded user-facing strings

## References

- MDN input type="week": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/week
