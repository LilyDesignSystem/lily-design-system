# DataTableCol

A column definition within a DataTable, rendered as a `<col>` element. Used inside a `<colgroup>` to define column properties such as span. Useful for styling entire columns of the data table.

## Props

- `span`: number (optional) -- number of columns this `<col>` spans
- `...restProps`: unknown -- additional attributes spread onto the `<col>`

## Usage

```svelte
<DataTable label="Users">
  <colgroup>
    <DataTableCol />
    <DataTableCol span={3} />
  </colgroup>
  ...
</DataTable>
```

## References

- HTML col element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col
