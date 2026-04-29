// DataTableFoot component
//
// The footer section of a DataTable, rendered as a <tfoot> element.
// Contains DataTableRow elements with summary or aggregate data cells.
//
// Props:
//   className — string, optional. CSS class name.
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

import React from "react";

export interface DataTableFootProps {
    className?: string;
    /** DataTableRow elements with footer cells. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function DataTableFoot({
    className = "",
    children,
    ...restProps
}: DataTableFootProps) {
    return (
        <tfoot
        className={`data-table-foot ${className}`}
        {...restProps}
        >
        {children}
        </tfoot>
    );
}
