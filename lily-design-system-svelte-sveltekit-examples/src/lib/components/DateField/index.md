# DateField

## Overview

A headless date field providing a fully labeled date input with built-in support
for descriptions and error messages. It wraps a native <input type="date"> with
a visible <label>, optional helper text, and validation error display, all linked
via auto-generated IDs for accessibility. Error messages are announced to screen
readers via role="alert". Ideal for forms requiring date input with validation.

## What it does

A structured field for entering date components.

## When to use

- Use when you need a structured field for entering date components.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<DateField label="Start date" bind:value />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Visible label text for the date field. |
| `value` | string, default "" | Current date value in YYYY-MM-DD format; bindable via bind:value. |
| `description` | string, default undefined | Helper text displayed below the input. |
| `error` | string, default undefined | Error message displayed when validation fails. |
| `required` | boolean, default false | Whether the field is required. |
| `disabled` | boolean, default false | Whether the field is disabled. |
| `id` | string, default undefined | Custom ID for the input element; auto-generated if omitted. |
| `...restProps` | additional HTML attributes spread onto the wrapper <div> |  |

## Examples

```svelte
<!-- Date field with error and required state -->
<DateField label="End date" bind:value error="Required" required />
<!-- Date field with description -->
<DateField label="Birthday" bind:value description="Format: YYYY-MM-DD" />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import DateField from "$lib/components/DateField/DateField.svelte";
</script>

<DateField label="Start date" bind:value />
```

## Keyboard

- None beyond native <input type="date"> keyboard behavior, which varies by browser

## Accessibility

- <label for={inputId}> links the visible label to the input
- aria-describedby links the input to its description text when present
- aria-invalid="true" indicates the input has an invalid value when error is present
- aria-errormessage links the input to its error message when present
- role="alert" on the error paragraph announces errors to screen readers

## Internationalization

- The label, description, and error props provide all text; no hardcoded strings

## References

- ARIA Error Handling: https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA21
- WAI Forms Tutorial: https://www.w3.org/WAI/tutorials/forms/
