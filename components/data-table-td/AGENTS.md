# DataTableTD

## Metadata

- Component: data-table-td
- PascalCase: DataTableTD
- Description: a data table interactive grid data cell for displaying and sorting tabular data <td>
- Status: stable — exercised in composed page flows under e2e and axe, beyond the per-component checks
- HTML tag: <td>
- CSS class: .data-table-td
- Interactive: no

## Composition

- Pattern: Table/Head/Body/Foot/Col/Row/Data
- Parent: data-table

## Key Behaviors

- Renders as a `<td>` element for a single data cell in a table row
- Children are the cell content (text, numbers, or other elements)
- Designed to be used inside DataTableRow or `<tr>` within a DataTable
- Spreads `restProps` onto the `<td>` element for consumer customization (e.g., `colspan`, `rowspan`, `headers`)
- No internal state -- purely a structural wrapper

## ARIA

- Implicit `cell` role from the `<td>` element -- identifies the element as a cell within a table row
- `active` (Svelte, React and Vue) makes this cell the grid's single roving tab stop — `tabindex="0"`, every other cell `-1` — and **never sets `aria-selected`**: focus is not selection, and announcing every focused cell as "selected" misleads screen-reader users. A grid with real selection sets `aria-selected` itself, on the row or explicitly on the cell (rest props pass it through). Corrected 2026-10-10; before that `active` set `aria-selected="true"` too.

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `active`: boolean (optional, default false) -- the roving tab stop; sets `tabindex` only, never `aria-selected`
- `children`: slot (required) -- cell content
- `...restProps`: Any additional HTML attributes passed to the `<td>` element

## Acceptance Criteria

- [ ] Renders <td> element with class="data-table-td"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .data-table-td in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/data-table-td.html
- WAI-ARIA Table Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/table/
- WAI Tutorial on Tables: https://www.w3.org/WAI/tutorials/tables/
