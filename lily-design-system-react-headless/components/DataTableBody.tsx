// DataTableBody component
//
// The body section of a DataTable, rendered as a <tbody> element.
// Contains DataTableRow elements with data cells.
//
// Props:
//   className — string, optional. CSS class name.
//   children — ReactNode, required. DataTableRow elements with data cells.
//   ...restProps — additional HTML attributes spread onto the <tbody>.
//
// Syntax:
//   <DataTableBody>
//     <DataTableRow>
//       <DataTableTD>Alice</DataTableTD>
//       <DataTableTD>alice@example.com</DataTableTD>
//     </DataTableRow>
//   </DataTableBody>
//
// Keyboard:
//   None built-in — keyboard navigation handled at the DataTable grid level.
//
// Accessibility:
//   - <tbody> provides structural body semantics for the table
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Must be used inside a DataTable
//   - No internal state — purely a structural wrapper
//
// References:
//   - HTML tbody element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tbody

import React from "react";

export interface DataTableBodyProps {
    className?: string;
    /** DataTableRow elements with data cells. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function DataTableBody({
    className = "",
    children,
    ...restProps
}: DataTableBodyProps) {
    return (
        <tbody
        className={`data-table-body ${className}`}
        {...restProps}
        >
        {children}
        </tbody>
    );
}
