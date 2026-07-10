# Kanban Table TH

KanbanTableTD is a headless component that renders a `<th scope="col">` element — a column header cell — intended to live inside a KanbanTableRow within KanbanTableHead, where it labels a workflow stage column (e.g. "To do", "In progress", "Done").

## Implementation Notes

- Renders a `<th>` element with `scope="col"` by default
- Accepts optional `colspan` / `rowspan` for grouped header cells
- Accepts an alternative `scope` (e.g. `"colgroup"` for grouped headers)
- Renders header text via children
- Spreads `restProps` onto the `<th>` element

## Props

- `colspan`: number (optional) -- number of columns this header cell spans
- `rowspan`: number (optional) -- number of rows this header cell spans
- `scope`: `"col" | "row" | "colgroup" | "rowgroup"` (default: `"col"`) -- header scope
- `children`: optional -- header cell content
- `...restProps`: unknown -- additional attributes spread onto the `<th>` element

## Usage

Three workflow stage column headers:

```html
<KanbanTable label="Sprint board">
    <KanbanTableHead>
        <KanbanTableRow>
            <KanbanTableTD>To do</KanbanTableTD>
            <KanbanTableTD>In progress</KanbanTableTD>
            <KanbanTableTD>Done</KanbanTableTD>
        </KanbanTableRow>
    </KanbanTableHead>
    <KanbanTableBody>
        ...
    </KanbanTableBody>
</KanbanTable>
```

## Keyboard Interactions

None. Header cells are not interactive.

## ARIA

`scope="col"` associates the header with its workflow column for assistive technologies. Use `scope="colgroup"` together with `colspan` for grouped column headers (e.g. "Active" spanning To-Do + In-Progress).

## When to Use

- For workflow stage column headers in a kanban board
- For grouped header cells via `colspan` / `rowspan`

## When Not to Use

- Do not use outside KanbanTable -- use TableTD or DataTableTD for other table types
- Do not use for task data cells -- use KanbanTableTD
- Do not use for column-wide styling hooks via `<colgroup>` / `<col>` -- write those directly inside KanbanTable

## Headless

This headless component renders a `<th>` element. The consumer provides all visual styling.

## Styles

The consumer provides all CSS styling. The component renders with a `.kanban-table-th` class for targeting.

## Testing

- Verify the component renders a `<th>` element
- Verify `scope="col"` is the default
- Verify `colspan` / `rowspan` are applied when set
- Verify pass-through attributes are applied

## Advice

- **Designers**: Use clear, short stage names (e.g. "To do", "In progress", "Done").
- **Developers**: Place KanbanTableTD elements inside a KanbanTableRow within KanbanTableHead.

## Composition

KanbanTableTD is part of the KanbanTable composition pattern: KanbanTable > KanbanTableHead > KanbanTableRow > KanbanTableTD.

## Related components

- `kanban-table` — a kanban board table interactive grid for organizing items by status <table>
- `kanban-table-body` — a kanban board table interactive grid tbody for organizing items by status <tbody>
- `kanban-table-foot` — a kanban board table interactive grid tfoot for organizing items by status <tfoot>
- `kanban-table-head` — a kanban board table interactive grid thead for organizing items by status <thead>
- `kanban-table-row` — a kanban board table interactive grid row for organizing items by status <tr>
- `kanban-table-td` — kanban board table interactive grid data cell for organizing items by status <td>
- `table` — a table with rows and columns <table>

## References

- MDN th element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th

---

Lily™ and Lily Design System™ are trademarks.
