# DataTableBody

The body section of a DataTable, rendered as a `<tbody>` element. Contains DataTableRow elements with data cells.

## Props

- `children`: Snippet (required) -- DataTableRow elements with data cells
- `...restProps`: unknown -- additional attributes spread onto the `<tbody>`

## Usage

```svelte
<DataTableBody>
  <DataTableRow>
    <DataTableTD>Alice</DataTableTD>
    <DataTableTD>alice@example.com</DataTableTD>
  </DataTableRow>
</DataTableBody>
```

## References

- HTML tbody element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tbody
