// TableRow component
//
// A single row in a Table, rendered as a <tr> element. Contains TableTH or TableTD cells.
//
// Props:
//   class — string, optional. CSS class name.
//   children — ReactNode, required. TableTH or TableTD cells.
//   ...restProps — additional HTML attributes spread onto the <tr>.
//
// Syntax:
//   <TableRow><TableTD>Alice</TableTD><TableTD>alice@example.com</TableTD></TableRow>
//
// Keyboard:
//   None — tables are non-interactive; consumers add interaction at the table level if needed.
//
// Accessibility:
//   - <tr> provides native table-section semantics
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Must be used inside a Table
//   - No internal state — purely a structural wrapper
//
// References:
//   - HTML tr element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tr

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface TableRowProps {
    class?: string;
    /** TableTH or TableTD cells. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function TableRow(props: TableRowProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "children");
    return (
        <tr
            class={`table-row ${p.class}`}
            {...restProps}
        >
            {p.children}
        </tr>
    );
}
