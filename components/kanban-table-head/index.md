# Kanban Table Head

A Kanban table head provides a header row for a Kanban board, containing column headings that label each workflow stage (e.g., "To Do", "In Progress", "Done"). It renders as a `<div>` with appropriate ARIA attributes and is designed to be used as a child of a KanbanTable component. The header establishes the visual and semantic structure for the columns below it.

## Implementation Notes

- Renders as a `<div>` for the Kanban board header area
- Contains column heading elements that label each workflow stage
- Consumer provides heading content through the children slot, typically a row of heading elements
- Spreads `...restProps` onto the `<div>` element for consumer customization
- No internal state -- purely a structural wrapper

## Props

- `children`: slot (required) -- column heading content for each workflow stage
- `...restProps`: any -- additional HTML attributes spread onto the `<div>` element

## Usage

Kanban board header with three workflow stages:

```html
<KanbanTable label="Sprint board">
    <KanbanTableHead>
        <KanbanTableRow>
            <KanbanTableCol>To Do</KanbanTableCol>
            <KanbanTableCol>In Progress</KanbanTableCol>
            <KanbanTableCol>Done</KanbanTableCol>
        </KanbanTableRow>
    </KanbanTableHead>
    <KanbanTableBody>
        ...
    </KanbanTableBody>
</KanbanTable>
```

## Keyboard Interactions

None -- passive container for heading elements. Keyboard interaction depends on interactive elements within the header content provided by the consumer.

## ARIA

- No explicit ARIA roles required -- the headings within provide their own semantic structure
- Column headings should use appropriate heading levels (e.g., `<h3>`) for proper document outline

## When to Use

- Use inside KanbanTable to provide column headings that label each workflow stage.
- Use when users need clear, visible labels for board columns such as "To Do", "In Progress", "Done".
- Use to establish the visual and semantic structure for the columns below it.

## When Not to Use

- Do not use outside of a KanbanTable parent -- use TableHead or DataTableHead for general tables.
- Do not use for footer summaries -- use KanbanTableFoot instead.

## Headless

This headless component provides a structural header wrapper for Kanban board column headings. It outputs a `<div>` container where the consumer places heading elements. The consumer provides all visual styling, including heading typography, alignment, and column width coordination.


## Styles

The consumer provides all CSS styling. The component renders with a `.kanban-table-head` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<thead>` element with class `kanban-table-head`
- Verify pass-through attributes are applied

## Advice

- **Designers**: Align column headings with their corresponding body columns and use consistent typography so the board structure is immediately clear.
- **Developers**: Use appropriate heading levels (e.g., `<h3>`) inside the header to maintain proper document outline and screen reader navigation.

## Composition

KanbanTableHead is a child of KanbanTable, appearing before KanbanTableBody. It is part of the KanbanTable compound component pattern.

```
KanbanTable → KanbanTableHead + KanbanTableBody + KanbanTableFoot
                └→ column headings
```

## References

- WAI-ARIA region role: https://www.w3.org/TR/wai-aria-1.2/#region
