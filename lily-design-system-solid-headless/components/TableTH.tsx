// TableTH component
//
// A header cell within a Table, rendered as a <th> element. Used inside a
// <TableRow> within <TableHead> to label columns, or with scope="row" to
// label a row.
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
//   - Must be used inside a <tr> within a Table
//
// References:
//   - HTML th element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface TableTHProps {
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

export default function TableTH(props: TableTHProps) {
    const p = merge({ class: "" as const, scope: "col" as const }, props);
    const restProps = omit(p, "class", "colSpan", "rowSpan", "scope", "children");
    return (
        <th
            class={`table-th ${p.class}`}
            scope={p.scope}
            colspan={p.colSpan || undefined}
            rowspan={p.rowSpan || undefined}
            {...restProps}
        >
            {p.children}
        </th>
    );
}
