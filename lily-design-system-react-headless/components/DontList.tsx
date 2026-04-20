// DontList component
//
// A list of discouraged actions or practices to avoid. Renders as a <ol> with
// role="list" and an accessible label. Used in design system documentation,
// guidelines, and instructional content to communicate what users should not do.
// Paired with DoList to create do/don't guidance patterns.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, default "Don't". Accessible name for the list.
//   children — ReactNode, required. List items, each should be an <li> element.
//   ...restProps — additional HTML attributes spread onto the <ol> element.
//
// Syntax:
//   <DontList><li>Avoid this</li></DontList>
//
// Examples:
//   
//   <DontList>
//     <li>Skip alt text</li>
//     <li>Use only color for meaning</li>
//   </DontList>
//
//   
//   <DontList label="Avoid">
//     <li>Hard-code user-facing strings</li>
//     <li>Rely on placeholder text as labels</li>
//   </DontList>
//
// Keyboard:
//   - None — passive container for list items
//
// Accessibility:
//   - role="list" preserves list semantics even when CSS removes default styling
//   - aria-label provides an accessible name (defaults to "Don't")
//
// Internationalization:
//   - The label prop defaults to "Don't" but can be overridden for any locale
//   - All list item text comes through consumer-provided children
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Companion to DoList; typically used together
//
// References:
//   - MDN ul element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul
//   - WAI list role: https://www.w3.org/WAI/ARIA/apd/roles/list/

import React from "react";

export interface DontListProps {
    className?: string;
    /** Accessible name for the list. */
    label?: string;
    /** List items. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function DontList({
    className = "",
    label = "Don't",
    children,
    ...restProps
}: DontListProps) {
    return (
        <ul
        className={`dont-list ${className}`}
        role="list"
        aria-label={label}
        {...restProps}
        >
        {children}
        </ul>
    );
}
