# MonthInput

## Overview

A headless month input that wraps a native <input type="month"> element with
accessible labelling for selecting a month and year. It provides a bindable
value in YYYY-MM format and supports required and disabled states. Useful for
credit card expiration dates, report periods, billing cycles, or any date
selection at month granularity.

## What it does

An input for selecting a month and year <input type="month">.

## When to use

- Use when you need the user to enter or pick a value in a form.

## When not to use

- Do not use for read-only display — use the matching `*View` component instead.

## Usage

```svelte
<MonthInput label="Start month" bind:value />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name for the input via aria-label. |
| `value` | string, default "" | Current month value in YYYY-MM format; bindable via $bindable(). |
| `required` | boolean, default false | Whether the input is required. |
| `disabled` | boolean, default false | Whether the input is disabled. |
| `...restProps` | additional HTML attributes spread onto the <input> |  |

## Examples

```svelte
<!-- Basic month picker -->
<MonthInput label="Start month" bind:value />

<!-- Required month input with min/max constraints -->
<MonthInput label="Expiration" bind:value required min="2024-01" max="2030-12" />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import MonthInput from "$lib/components/MonthInput/MonthInput.svelte";
</script>

<MonthInput label="Start month" bind:value />
```

## Keyboard

- Native browser month input keyboard behavior (varies by browser).

## Accessibility

- aria-label={label} provides an accessible name describing the input purpose
- Supports required and disabled HTML states

## Internationalization

- The label prop accepts any translated string
- No hardcoded user-facing strings

## References

- HTML month input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/month
