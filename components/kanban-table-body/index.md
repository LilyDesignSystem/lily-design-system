# Kanban Table Body

A Kanban table body provides the main content area of a Kanban board, containing the columns and cards that represent work items at various workflow stages. It renders as a `<div>` and is designed to be used as a child of a KanbanTable component. The body area holds the column containers with their respective card items.

## Implementation Notes

- Renders as a `<div>` for the main Kanban board content area
- Consumer provides column containers and card items through the children slot
- Each column within the body typically uses `role="list"` with KanbanTableTD items as `role="listitem"` children
- Spreads `...restProps` onto the `<div>` element for consumer customization
- No internal state -- purely a structural wrapper

## Props

- `children`: slot (required) -- column containers with card content
- `...restProps`: any -- additional HTML attributes spread onto the `<div>` element

## Usage

Kanban board body with task cards across workflow stages:

```html
<KanbanTable label="Sprint board">
    <KanbanTableHead>
        ...
    </KanbanTableHead>
    <KanbanTableBody>
        <KanbanTableRow>
            <KanbanTableTD label="Fix login bug">
                <h4>Fix login bug</h4>
                <p>Assigned to Alice</p>
            </KanbanTableTD>
            <KanbanTableTD label="Add dashboard">
                <h4>Add dashboard</h4>
                <p>Assigned to Bob</p>
            </KanbanTableTD>
            <KanbanTableTD label="Setup CI/CD">
                <h4>Setup CI/CD</h4>
            </KanbanTableTD>
        </KanbanTableRow>
    </KanbanTableBody>
</KanbanTable>
```

## Keyboard Interactions

None -- passive container. Keyboard interaction depends on interactive elements within the card content provided by the consumer, such as drag-and-drop controls or card action buttons.

## ARIA

- No explicit ARIA roles required on the body container itself
- Column containers within should use `role="list"` with `aria-label` to identify each workflow stage
- Card items within columns should use `role="listitem"` (provided by KanbanTableTD)

## When to Use

- Use inside KanbanTable to wrap the main content area containing columns and card items.
- Use when you need a structural container to separate board content from the header and footer areas.
- Use to hold the column containers that contain KanbanTableTD card items.

## When Not to Use

- Do not use outside of a KanbanTable parent -- use TableBody or DataTableBody for general tables.
- Do not use for header content -- use KanbanTableHead instead.

## Headless

This headless component provides the semantic structure for a Kanban board content area, including proper list container roles for columns. The consumer provides all visual styling, including column layout, card appearance, spacing, and drag-and-drop affordances.


## Styles

The consumer provides all CSS styling. The component renders with a `.kanban-table-body` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<tbody>` element with class `kanban-table-body`
- Verify Column containers within should use `role="list"` with `aria-label` to identify each workflow stage
- Verify Card items within columns should use `role="listitem"` (provided by KanbanTableTD)
- Verify pass-through attributes are applied

## Advice

- **Designers**: Use clear visual separation between columns, such as background shading or borders, so users can quickly identify workflow stages.
- **Developers**: Ensure each column container within the body uses `role="list"` with an `aria-label` matching the column heading for screen reader navigation.

## Composition

KanbanTableBody is part of the KanbanTable compound component. It is used as a child of KanbanTable alongside KanbanTableHead and optionally KanbanTableFoot. It contains column containers that hold KanbanTableTD card items.

```
KanbanTable → KanbanTableHead + KanbanTableBody + KanbanTableFoot
                                  └→ columns → KanbanTableTD
```

## Related components

- `kanban-table` — a kanban board table interactive grid for organizing items by status <table>
- `kanban-table-foot` — a kanban board table interactive grid tfoot for organizing items by status <tfoot>
- `kanban-table-head` — a kanban board table interactive grid thead for organizing items by status <thead>
- `kanban-table-row` — a kanban board table interactive grid row for organizing items by status <tr>
- `kanban-table-td` — kanban board table interactive grid data cell for organizing items by status <td>
- `kanban-table-th` — a kanban board table interactive grid header cell for organizing items by status <th>
- `table` — a table with rows and columns <table>

## References

- WAI-ARIA Listbox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
- WAI-ARIA region role: https://www.w3.org/TR/wai-aria-1.2/#region

---

Lily™ and Lily Design System™ are trademarks.
