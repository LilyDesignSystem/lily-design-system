// TableHead component
//
// The header section of a Table, rendered as a <thead> element. Contains
// TableRow elements with column header cells.
//
// Props:
//   className — string, optional. CSS class name.
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

import React from "react";

export interface TableHeadProps {
    className?: string;
    /** TableRow elements with header cells. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function TableHead({
    className = "",
    children,
    ...restProps
}: TableHeadProps) {
    return (
        <thead
            className={`table-head ${className}`}
            {...restProps}
        >
            {children}
        </thead>
    );
}
