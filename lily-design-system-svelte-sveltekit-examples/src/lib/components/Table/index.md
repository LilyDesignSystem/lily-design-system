# Table

## Overview

A headless table that renders a semantic <table> element with an accessible
label. Used to display structured data in rows and columns for reports,
schedules, product lists, and dashboards. The consumer provides all table
content (thead, tbody, tfoot, caption, colgroup, etc.) through the children
snippet, maintaining full control over table structure and styling.

## What it does

A table with rows and columns <table>.

## When to use

- Use to display structured tabular data with headers and rows.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<Table label="User accounts">...</Table>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible label for the table via aria-label. |
| `children` | Snippet, required | Table content including thead, tbody, tfoot, etc. |
| `...restProps` | additional HTML attributes spread onto the <table> |  |

## Examples

```svelte
<!-- Data table with column headers -->
<Table label="User accounts">
  <thead><tr><th scope="col">Name</th><th scope="col">Email</th></tr></thead>
  <tbody><tr><td>Alice</td><td>alice@example.com</td></tr></tbody>
</Table>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Table from "$lib/components/Table/Table.svelte";
</script>

<Table label="User accounts">...</Table>
```

## Keyboard

- None directly -- standard table navigation is handled by screen readers

## Accessibility

- aria-label provides the accessible name for screen readers
- Semantic <table> element conveys tabular data structure
- Consumers should use <th scope="col"> for column headers
- Consumers should use <th scope="row"> for row headers
- Consumers may add <caption> for a visible table title

## Internationalization

- The label prop externalizes user-facing text for translation
- All content is provided through the children snippet
- No hardcoded strings in the component

## References

- WAI-ARIA Table Role: https://www.w3.org/WAI/ARIA/apd/patterns/table/
- HTML Table Element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table
