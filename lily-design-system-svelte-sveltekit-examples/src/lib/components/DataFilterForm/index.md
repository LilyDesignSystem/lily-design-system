# DataFilterForm

## Overview

A headless data filter container that wraps filter controls in a semantic <form>
with role="search" and accessible labelling. It prevents default form submission,
allowing the consumer's onsubmit callback to handle filter application
programmatically. Suitable for client-side filtering, AJAX-based search, or any
scenario where a full page reload is undesirable.

## What it does

A form for filtering data by criteria.

## When to use

- Use when you need a form for filtering data by criteria.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<DataFilterForm label="Filter results" onsubmit={applyFilters}>
  <button type="submit">Apply</button>
</DataFilterForm>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name for the filter region via aria-label. |
| `onsubmit` | (event: SubmitEvent) => void, default undefined | Called when the form is submitted. |
| `onreset` | (event: Event) => void, default undefined | Called when the form is reset. |
| `children` | Snippet, required | Filter controls rendered inside the form. |
| `...restProps` | additional HTML attributes spread onto the <form> |  |

## Examples

```svelte
<!-- Filter with category select, submit, and reset -->
<DataFilterForm label="Filter results" onsubmit={applyFilters} onreset={clearFilters}>
  <label>Category <select>...</select></label>
  <button type="submit">Apply</button>
  <button type="reset">Clear</button>
</DataFilterForm>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import DataFilterForm from "$lib/components/DataFilterForm/DataFilterForm.svelte";
</script>

<DataFilterForm label="Filter results" onsubmit={applyFilters}>
  <button type="submit">Apply</button>
</DataFilterForm>
```

## Keyboard

- None — passive container; keyboard behavior is determined by consumer-provided form controls

## Accessibility

- role="search" identifies the form as a search landmark for assistive technology
- aria-label provides an accessible name for the search region

## Internationalization

- The label prop provides the accessible name; no hardcoded strings
- All filter controls and button text are provided by consumers

## References

- WAI-ARIA Landmark Roles: https://www.w3.org/WAI/ARIA/apd/practices/landmark-regions/
- ARIA search role: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/search_role
