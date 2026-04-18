# DataTableHead

The header section of a DataTable, rendered as a `<thead>` element. Contains DataTableRow elements with column header cells.

## Props

- `children`: Snippet (required) -- DataTableRow elements with header cells
- `...restProps`: unknown -- additional attributes spread onto the `<thead>`

## Usage

```svelte
<DataTableHead>
  <DataTableRow><th scope="col">Name</th><th scope="col">Email</th></DataTableRow>
</DataTableHead>
```

## References

- HTML thead element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/thead
