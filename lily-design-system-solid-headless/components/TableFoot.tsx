// TableFoot component
//
// The footer section of a Table, rendered as a <tfoot> element. Contains TableRow elements with summary or footer cells.
//
// Props:
//   class — string, optional. CSS class name.
//   children — ReactNode, required. TableRow elements with footer cells.
//   ...restProps — additional HTML attributes spread onto the <tfoot>.
//
// Syntax:
//   <TableFoot>
//     <TableRow><TableTD colSpan={2}>Total: 2 users</TableTD></TableRow>
//   </TableFoot>
//
// Keyboard:
//   None — tables are non-interactive; consumers add interaction at the table level if needed.
//
// Accessibility:
//   - <tfoot> provides native table-section semantics
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Must be used inside a Table
//   - No internal state — purely a structural wrapper
//
// References:
//   - HTML tfoot element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tfoot

import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export interface TableFootProps {
    class?: string;
    /** TableRow elements with footer cells. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function TableFoot(props: TableFootProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(p, "class", "children");
    return (
        <tfoot
            class={`table-foot ${p.class}`}
            {...restProps}
        >
            {p.children}
        </tfoot>
    );
}
