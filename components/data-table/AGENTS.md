# DataTable

## Metadata

- Component: data-table
- PascalCase: DataTable
- Description: a data table interactive grid for displaying and sorting tabular data <table>
- Status: stable — exercised in composed page flows under e2e and axe, beyond the per-component checks
- HTML tag: <table>
- CSS class: .data-table
- Interactive: yes

## Composition

- Pattern: Table/Head/Body/Foot/Col/Row/Data
- Children: data-table-head, data-table-body, data-table-foot, data-table-th, data-table-row, data-table-td

## Key Behaviors

- Renders a semantic `<table role="grid">` element
- Conditionally renders a `<caption>` element when the `caption` prop is provided
- Uses `aria-label` only when no `caption` is present, to avoid duplicate accessible names
- Spreads `restProps` onto the `<table>` for consumer customization
- Consumers are responsible for `<thead>`, `<tbody>`, `scope` attributes on `<th>`, and all row/cell structure
- Owns the grid keys below, over the cells the consumer renders; a root inside `[data-consumer-keys]` attaches none, for a consumer running its own

## ARIA

- `role="grid"` -- the table is a grid of cells, with the keys below
- `aria-label={label}` -- provides an accessible name when no visible caption is present
- `<caption>` -- semantic table caption that serves as the accessible name when provided

## Keyboard

- Tab: moves to the table, on its one tab stop, and out of it
- ArrowRight / ArrowLeft: next or previous cell in the row, swapped in right-to-left; stops at the edge
- ArrowDown / ArrowUp: next or previous row; stops at the edge
- Home / End: first or last cell in the row
- Ctrl+Home / Ctrl+End (Cmd on macOS): first or last cell in the table
- PageDown / PageUp: ten rows, stopping at the edge
- Enter or F2: go to the first control in the cell, which keeps its own keys
- Escape: from a control, back to its cell
- Selecting, sorting and editing are the consumer's. A consumer running its own grid keys, as the `data-grid` helper does, sets `data-consumer-keys` on the root.

## Props

- `caption`: string (default: undefined) -- visible caption text displayed above the table
- `label`: string (default: undefined) -- accessible label used when `caption` is not provided
- `children`: slot (required) -- table content including thead, tbody, tr, th, td elements

## Acceptance Criteria

- [ ] Renders <table> element with class="data-table"
- [ ] Has aria-label attribute
- [ ] Has role="grid"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .data-table in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/data-table.html
- WAI-ARIA Table Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/table/
- WAI Tutorial on Tables: https://www.w3.org/WAI/tutorials/tables/
