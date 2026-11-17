// DataTableHead component
//
// The header section of a DataTable, rendered as a <thead> element.
// Contains DataTableRow elements with column header cells.
//
// Props:
//   class — string, optional. CSS class name.
//   children — ReactNode, required. DataTableRow elements with header cells.
//   ...restProps — additional HTML attributes spread onto the <thead>.
//
// Syntax:
//   <DataTableHead>
//     <DataTableRow><th scope="col">Name</th><th scope="col">Email</th></DataTableRow>
//   </DataTableHead>
//
// Keyboard:
//   None built-in — keyboard navigation handled at the DataTable grid level.
//
// Accessibility:
//   - <thead> provides structural header semantics for the table
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Must be used inside a DataTable
//   - No internal state — purely a structural wrapper
//
// References:
//   - HTML thead element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/thead

import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export interface DataTableHeadProps {
    class?: string;
    /** DataTableRow elements with header cells. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function DataTableHead(props: DataTableHeadProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(p, "class", "children");
    return (
        <thead
            class={`data-table-head ${p.class}`}
            {...restProps}
        >
            {p.children}
        </thead>
    );
}
