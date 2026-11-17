// DataTableFoot component
//
// The footer section of a DataTable, rendered as a <tfoot> element.
// Contains DataTableRow elements with summary or aggregate data cells.
//
// Props:
//   class — string, optional. CSS class name.
//   children — ReactNode, required. DataTableRow elements with footer cells.
//   ...restProps — additional HTML attributes spread onto the <tfoot>.
//
// Syntax:
//   <DataTableFoot>
//     <DataTableRow>
//       <DataTableTD>Total</DataTableTD>
//       <DataTableTD>$50,000</DataTableTD>
//     </DataTableRow>
//   </DataTableFoot>
//
// Keyboard:
//   None built-in — keyboard navigation handled at the DataTable grid level.
//
// Accessibility:
//   - <tfoot> provides structural footer semantics for the table
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Must be used inside a DataTable
//   - No internal state — purely a structural wrapper
//
// References:
//   - HTML tfoot element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tfoot

import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export interface DataTableFootProps {
    class?: string;
    /** DataTableRow elements with footer cells. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function DataTableFoot(props: DataTableFootProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(p, "class", "children");
    return (
        <tfoot
            class={`data-table-foot ${p.class}`}
            {...restProps}
        >
            {p.children}
        </tfoot>
    );
}
