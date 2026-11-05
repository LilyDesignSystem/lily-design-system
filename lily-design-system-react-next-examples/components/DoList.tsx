// DoList component
//
// A list of recommended actions or best practices. Renders as a <ol> with
// role="list" and an accessible label. Used in design system documentation,
// guidelines, and instructional content to communicate what users should do.
// Paired with DontList to create do/don't guidance patterns.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. No default: the words are yours. Accessible name for the list.
//   children — ReactNode, required. List items, each should be an <li> element.
//   ...restProps — additional HTML attributes spread onto the <ol> element.
//
// Syntax:
//   <DoList label="Do"><li>Best practice</li></DoList>
//
// Examples:
//
//   <DoList label="Do">
//     <li>Write clear labels</li>
//     <li>Use semantic HTML</li>
//   </DoList>
//
//
//   <DoList label="Recommended">
//     <li>Provide alt text for images</li>
//     <li>Use sufficient color contrast</li>
//   </DoList>
//
// Keyboard:
//   - None — passive container for list items
//
// Accessibility:
//   - role="list" preserves list semantics even when CSS removes default styling
//   - aria-label provides the accessible name
//
// Internationalization:
//   - The label prop is required: the words are yours
//   - All list item text comes through consumer-provided children
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Companion to DontList; typically used together
//
// References:
//   - MDN ul element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul
//   - WAI list role: https://www.w3.org/WAI/ARIA/apd/roles/list/

import React from "react";

export interface DoListProps {
    className?: string;
    /** Accessible name for the list. */
    label: string;
    /** List items. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function DoList({ className = "", label, children, ...restProps }: DoListProps) {
    return (
        <ul
            className={`do-list ${className}`}
            role="list"
            aria-label={label}
            {...restProps}
        >
            {children}
        </ul>
    );
}
