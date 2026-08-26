// TableRow component
//
// A single row in a Table, rendered as a <tr> element. Contains TableTH or TableTD cells.
//
// Props:
//   className — string, optional. CSS class name.
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

import React from "react";

export interface TableRowProps {
    className?: string;
    /** TableTH or TableTD cells. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function TableRow({
    className = "",
    children,
    ...restProps
}: TableRowProps) {
    return (
        <tr
            className={`table-row ${className}`}
            {...restProps}
        >
            {children}
        </tr>
    );
}
