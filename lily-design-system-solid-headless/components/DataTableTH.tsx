// DataTableTH component
//
// A column header cell within a DataTable, rendered as a <th> element.
// Used inside a <DataTableRow> within <DataTableHead> to label the columns
// of the data table.
//
// Props:
//   class — string, optional. CSS class name.
//   colSpan — number, optional. Number of columns this header cell spans.
//   rowSpan — number, optional. Number of rows this header cell spans.
//   scope — "col" | "row" | "colgroup" | "rowgroup", default "col". Header scope.
//   children — ReactNode, optional. Header cell content.
//   ...restProps — additional HTML attributes spread onto the <th>.
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Must be used inside a <tr> within a DataTable
//
// References:
//   - HTML th element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface DataTableTHProps {
    class?: string;
    /** Number of columns this header cell spans. */
    colSpan?: number;
    /** Number of rows this header cell spans. */
    rowSpan?: number;
    /** Header scope. */
    scope?: "col" | "row" | "colgroup" | "rowgroup";
    /** Header cell content. */
    children?: JSX.Element;
    [key: string]: unknown;
}

export default function DataTableTH(props: DataTableTHProps) {
    const p = merge({ class: "" as const, scope: "col" as const }, props);
    const restProps = omit(p, "class", "colSpan", "rowSpan", "scope", "children");
    return (
        <th
            class={`data-table-th ${p.class}`}
            scope={p.scope}
            colspan={p.colSpan || undefined}
            rowspan={p.rowSpan || undefined}
            {...restProps}
        >
            {p.children}
        </th>
    );
}
