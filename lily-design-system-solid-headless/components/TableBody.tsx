// TableBody component
//
// The body section of a Table, rendered as a <tbody> element. Contains TableRow elements with data cells.
//
// Props:
//   class — string, optional. CSS class name.
//   children — ReactNode, required. TableRow elements with data cells.
//   ...restProps — additional HTML attributes spread onto the <tbody>.
//
// Syntax:
//   <TableBody>
//     <TableRow><TableTD>Alice</TableTD><TableTD>alice@example.com</TableTD></TableRow>
//   </TableBody>
//
// Keyboard:
//   None — tables are non-interactive; consumers add interaction at the table level if needed.
//
// Accessibility:
//   - <tbody> provides native table-section semantics
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Must be used inside a Table
//   - No internal state — purely a structural wrapper
//
// References:
//   - HTML tbody element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tbody

import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export interface TableBodyProps {
    class?: string;
    /** TableRow elements with data cells. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function TableBody(props: TableBodyProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(p, "class", "children");
    return (
        <tbody
            class={`table-body ${p.class}`}
            {...restProps}
        >
            {p.children}
        </tbody>
    );
}
