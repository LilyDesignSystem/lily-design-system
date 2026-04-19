# ErrorSummary

## Overview

Displays a consolidated list of form validation errors at the top of a form.
Uses role="alert" and aria-labelledby for immediate screen reader announcement.
The tabindex="-1" allows programmatic focus after form submission. Children
typically contain a list of linked error messages pointing to specific fields.
Follows the GOV.UK and NHS England error summary design pattern.

## What it does

A summary of all validation errors on a form.

## When to use

- Use when you need a summary of all validation errors on a form.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<ErrorSummary title="There is a problem">
  <ul><li><a href="#field">Error description</a></li></ul>
</ErrorSummary>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `title` | string, required | Heading text for the error summary (e.g., "There is a problem"). |
| `children` | Snippet, required | Error list content, typically a <ul> with <li> anchor links. |
| `...restProps` | additional HTML attributes spread onto the outer <div> |  |

## Examples

```svelte
<!-- Error summary with linked errors -->
<ErrorSummary title="There is a problem">
  <ul>
    <li><a href="#name">Enter your name</a></li>
    <li><a href="#email">Enter a valid email address</a></li>
  </ul>
</ErrorSummary>

<!-- Single error -->
<ErrorSummary title="Please fix the following errors">
  <ul>
    <li><a href="#password">Password must be at least 8 characters</a></li>
  </ul>
</ErrorSummary>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import ErrorSummary from "$lib/components/ErrorSummary/ErrorSummary.svelte";
</script>

<ErrorSummary title="There is a problem">
  <ul><li><a href="#field">Error description</a></li></ul>
</ErrorSummary>
```

## Keyboard

- Tab: moves focus through the error links within the summary
- The container can receive programmatic focus via element.focus()

## Accessibility

- role="alert" creates a live region announced immediately by screen readers
- aria-labelledby associates the alert region with its heading
- tabindex="-1" allows programmatic focus without being in the tab order
- Contains an <h2> heading for the error summary title

## Internationalization

- The title prop accepts any string; consumers provide localized text
- All error messages come through consumer-provided children

## References

- GOV.UK Error Summary: https://design-system.service.gov.uk/components/error-summary/
- WAI-ARIA Alert Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/alert/
