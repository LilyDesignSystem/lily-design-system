# KanbanTableTD

A column header cell within a KanbanTable, rendered as a `<th scope="col">` element. Intended to live inside a KanbanTableRow within KanbanTableHead, where it labels a workflow stage column.

## Props

- `colSpan`: number (optional) -- number of columns this header cell spans
- `rowSpan`: number (optional) -- number of rows this header cell spans
- `scope`: `"col" | "row" | "colgroup" | "rowgroup"` (default `"col"`)
- `children`: optional -- header cell content
- `...restProps`: unknown -- additional attributes spread onto the `<th>`

## Usage

```tsx
<KanbanTable label="Board">
  <KanbanTableHead>
    <KanbanTableRow>
      <KanbanTableTD>To do</KanbanTableTD>
      <KanbanTableTD>In progress</KanbanTableTD>
      <KanbanTableTD>Done</KanbanTableTD>
    </KanbanTableRow>
  </KanbanTableHead>
  ...
</KanbanTable>
```

## References

- HTML th element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th
