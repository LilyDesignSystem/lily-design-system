// DataTable component
//
// An interactive data table that displays structured information in rows and
// columns as a grid widget. Renders a <table> element with role="grid" and an
// accessible label. Supports an optional visible caption. Commonly used for
// sortable tables, editable spreadsheets, and interactive data grids.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, required. Accessible name describing the table content.
//   caption — string, optional. Visible caption text displayed above the table.
//   children — ReactNode, required. DataTableHead, DataTableBody, DataTableFoot elements.
//   ...restProps — additional HTML attributes spread onto the <table>.
//
// Syntax:
//   <DataTable label="User accounts">
//     <DataTableHead><DataTableRow><th scope="col">Name</th></DataTableRow></DataTableHead>
//     <DataTableBody><DataTableRow><DataTableTD>Alice</DataTableTD></DataTableRow></DataTableBody>
//   </DataTable>
//
// Examples:
//
//   <DataTable label="Sales data" caption="Quarterly sales">
//     <DataTableHead>
//       <DataTableRow><th scope="col">Month</th><th scope="col">Revenue</th></DataTableRow>
//     </DataTableHead>
//     <DataTableBody>
//       <DataTableRow><DataTableTD>January</DataTableTD><DataTableTD>$10,000</DataTableTD></DataTableRow>
//     </DataTableBody>
//   </DataTable>
//
// Keyboard:
//   Arrows, Home, End, Ctrl+Home, Ctrl+End, PageUp, PageDown, Enter, F2 and Escape over the cells, with one tab stop; data-consumer-keys on the root turns them off.
//
// Accessibility:
//   - role="grid" identifies the table as an interactive grid widget
//   - aria-label provides an accessible name describing the table content
//   - <caption> provides a visible accessible name when the caption prop is set
//
// Internationalization:
//   - The label and caption props provide all text; no hardcoded strings
//   - All cell content is provided by consumers through children
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Compound component: use with DataTableHead, DataTableBody, DataTableFoot,
//     DataTableRow, DataTableTD, and DataTableTD
//
// References:
//   - WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/

import type { JSX } from "@solidjs/web";
import { omit, onSettled, untrack } from "solid-js";
import { withDefaults } from "./defaults";
import { warnMissingName } from "./dev-warning";
import { attachGrid } from "./widget-keys";

export interface DataTableProps {
    class?: string;
    /** Accessible name describing the table content. */
    label: string;
    /** Visible caption for the table. */
    caption?: string;
    /** Table content (DataTableHead, DataTableBody, etc.). */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function DataTable(props: DataTableProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "caption", "children");
    warnMissingName("DataTable", p.label, p["aria-labelledby"]);
    const rootRef: { current: HTMLTableElement | null } = { current: null };
    onSettled(() => untrack(() => attachGrid(rootRef.current!)));
    return (
        <table
            ref={(el) => (rootRef.current = el)}
            class={`data-table ${p.class}`}
            role="grid"
            aria-label={p.label}
            {...restProps}
        >
            {p.caption && (
                <>
                    <caption>{p.caption}</caption>
                </>
            )}
            {p.children}
        </table>
    );
}
