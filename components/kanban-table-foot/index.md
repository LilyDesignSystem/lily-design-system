# Kanban Table Foot

A Kanban table foot provides an optional footer area for a Kanban board, typically used for board-level summary information or actions such as "Add column", item counts per column, or aggregate status indicators. It renders as a `<div>` and is designed to be used as a child of a KanbanTable component, appearing below the KanbanTableBody.

## Implementation Notes

- Renders as a `<div>` for the Kanban board footer area
- Optional component -- only include when the board needs footer-level actions or summaries
- Consumer provides footer content through the children slot
- Spreads `...restProps` onto the `<div>` element for consumer customization
- No internal state -- purely a structural wrapper

## Props

- `children`: slot (required) -- footer content such as action buttons, item counts, or summary information
- `...restProps`: any -- additional HTML attributes spread onto the `<div>` element

## Usage

Kanban board footer with item count and action button:

```html
<KanbanTable label="Sprint board">
    <KanbanTableHead>
        ...
    </KanbanTableHead>
    <KanbanTableBody>
        ...
    </KanbanTableBody>
    <KanbanTableFoot>
        <KanbanTableRow>
            <KanbanTableData>3 items</KanbanTableData>
            <KanbanTableData>5 items</KanbanTableData>
            <KanbanTableData>4 items</KanbanTableData>
        </KanbanTableRow>
    </KanbanTableFoot>
</KanbanTable>
```

## Keyboard Interactions

None -- passive container. Keyboard interaction depends on interactive elements within the footer content provided by the consumer.

## ARIA

- No explicit ARIA roles required on the footer container itself
- Interactive elements within the footer (e.g., buttons) provide their own semantics

## When to Use

- Use inside KanbanTable to provide a footer area with summary information, item counts, or board-level actions.
- Use when the board needs persistent controls such as "Add column" or aggregate status indicators.
- Use for displaying total counts or completion metrics below the board.

## When Not to Use

- Do not use outside of a KanbanTable parent -- use TableFoot or DataTableFoot for general tables.
- Do not use when the board does not require footer-level information -- this component is optional.

## Headless

This headless component provides a structural footer wrapper for a Kanban board. It outputs a `<div>` container with no ARIA roles, relying on its child content for semantics. The consumer provides all visual styling, including layout, spacing, and appearance of footer controls.


## Styles

The consumer provides all CSS styling. The component renders with a `.kanban-table-foot` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<tfoot>` element with class `kanban-table-foot`
- Verify pass-through attributes are applied

## Advice

- **Designers**: Keep footer content minimal and visually distinct from the board body so users do not confuse summary data with active cards.
- **Developers**: Place interactive elements like buttons in the footer with clear accessible labels, as the footer container itself is a passive wrapper.

## Composition

KanbanTableFoot is an optional child of KanbanTable, appearing after KanbanTableBody. It is part of the KanbanTable compound component pattern.

```
KanbanTable → KanbanTableHead + KanbanTableBody + KanbanTableFoot (optional)
```

## References

- WAI-ARIA region role: https://www.w3.org/TR/wai-aria-1.2/#region
