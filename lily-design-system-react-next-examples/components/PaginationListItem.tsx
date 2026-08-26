// PaginationListItem component
//
// A single entry within a PaginationList navigation component. It renders as a
// semantic <li> element designed for use inside the PaginationList's <ul> structure.
// The item typically contains a link or button for a specific page number,
// previous/next controls, or an ellipsis indicator.
//
// Props:
//   className — string, optional. CSS class name.
//   children — ReactNode, required. Item content, typically a link or button.
//   ...restProps — additional HTML attributes spread onto the <li>.
//
// Syntax:
//   <PaginationListItem><a href="/page/1">1</a></PaginationListItem>
//
// Examples:
//   
//   <PaginationListItem><a href="/page/1">1</a></PaginationListItem>
//
//   
//   <PaginationListItem><a href="/page/2" aria-current="page">2</a></PaginationListItem>
//
// Keyboard:
//   None directly — keyboard interaction is handled by the contained links or buttons.
//
// Accessibility:
//   - Implicit listitem role from the semantic <li> element
//   - Consumer should set aria-current="page" on the active page link within the item
//
// Internationalization:
//   - All text content comes through the children prop
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - This is a compound component child; use inside PaginationList
//   - Do not add link or button elements — consumer provides all content
//
// References:
//   - HTML li element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li

import React from "react";

export interface PaginationListItemProps {
    className?: string;
    /** Item content. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function PaginationListItem({
    className = "",
    children,
    ...restProps
}: PaginationListItemProps) {
    return (
        <li
        className={`pagination-list-item ${className}`}
        {...restProps}
        >
        {children}
        </li>
    );
}
