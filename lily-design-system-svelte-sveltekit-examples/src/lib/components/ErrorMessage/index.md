# ErrorMessage

## Overview

Displays an error message using role="alert" for immediate screen reader
announcement. Renders a <p> element that acts as an assertive live region,
so the error text is announced as soon as it enters the DOM. Used for form
validation feedback, system error notifications, and inline error display.

## What it does

An error message associated with a form field.

## When to use

- Use when you need an error message associated with a form field.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<ErrorMessage>Error text here</ErrorMessage>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `children` | Snippet, required | Error message text content. |
| `...restProps` | additional HTML attributes spread onto the <p> element |  |

## Examples

```svelte
<!-- Inline error message -->
<ErrorMessage>Password is required</ErrorMessage>

<!-- Conditional error display -->
{#if error}
  <ErrorMessage>{error}</ErrorMessage>
{/if}
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import ErrorMessage from "$lib/components/ErrorMessage/ErrorMessage.svelte";
</script>

<ErrorMessage>Error text here</ErrorMessage>
```

## Keyboard

- None — passive container for displaying error text

## Accessibility

- role="alert" creates an implicit aria-live="assertive" live region
- Error text is announced immediately to screen readers when it appears

## Internationalization

- All error text comes through consumer-provided children

## References

- WAI-ARIA Alert Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/alert/
