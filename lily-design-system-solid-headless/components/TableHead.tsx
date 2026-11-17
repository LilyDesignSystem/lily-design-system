// TableHead component
//
// The header section of a Table, rendered as a <thead> element. Contains
// TableRow elements with column header cells.
//
// Props:
//   class — string, optional. CSS class name.
//   children — ReactNode, required. TableRow elements with header cells.
//   ...restProps — additional HTML attributes spread onto the <thead>.
//
// Syntax:
//   <TableHead>
//     <TableRow><TableTH>Name</TableTH><TableTH>Email</TableTH></TableRow>
//   </TableHead>
//
// Keyboard:
//   None — tables are non-interactive; consumers add interaction at the table level if needed.
//
// Accessibility:
//   - <thead> provides structural header semantics for the table
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Must be used inside a Table
//   - No internal state — purely a structural wrapper
//
// References:
//   - HTML thead element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/thead

import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export interface TableHeadProps {
    class?: string;
    /** TableRow elements with header cells. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function TableHead(props: TableHeadProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(p, "class", "children");
    return (
        <thead
            class={`table-head ${p.class}`}
            {...restProps}
        >
            {p.children}
        </thead>
    );
}
