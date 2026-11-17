// TableTD component
//
// A data cell within a Table, rendered as a <td> element. Used inside a
// <TableRow> within <TableBody> or <TableFoot> to hold one cell of data.
//
// Props:
//   class — string, optional. CSS class name.
//   colSpan — number, optional. Number of columns this cell spans.
//   rowSpan — number, optional. Number of rows this cell spans.
//   children — ReactNode, optional. Cell content.
//   ...restProps — additional HTML attributes spread onto the <td>.
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Must be used inside a <tr> within a Table
//
// References:
//   - HTML td element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td

import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export interface TableTDProps {
    class?: string;
    /** Number of columns this cell spans. */
    colSpan?: number;
    /** Number of rows this cell spans. */
    rowSpan?: number;
    /** Cell content. */
    children?: JSX.Element;
    [key: string]: unknown;
}

export default function TableTD(props: TableTDProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(p, "class", "colSpan", "rowSpan", "children");
    return (
        <td
            class={`table-td ${p.class}`}
            colspan={p.colSpan || undefined}
            rowspan={p.rowSpan || undefined}
            {...restProps}
        >
            {p.children}
        </td>
    );
}
