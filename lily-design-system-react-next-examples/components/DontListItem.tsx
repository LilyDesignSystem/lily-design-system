// DontListItem component
//
// A single discouraged-practice item within a "Don't" list. Renders a semantic
// <li> element representing a guideline or practice that users should avoid.
// Commonly used in design system documentation, style guides, and instructional
// content to show anti-patterns alongside DoListItem.
//
// The component sets data-recommendation="dont" for consumer styling hooks,
// enabling visual differentiation (e.g. red crosses, danger borders) without
// embedding any styles itself.
//
// Props:
//   className — string, optional. CSS class name.
//   children — ReactNode, required. The discouraged-practice content.
//   ...restProps — additional HTML attributes spread onto the <li>.
//
// Syntax:
//   <DontListItem>Use vague placeholder text</DontListItem>
//
// Examples:
//   
//   <ul aria-label="Practices to avoid">
//     <DontListItem>Use color alone to convey meaning</DontListItem>
//     <DontListItem>Remove focus outlines without replacement</DontListItem>
//     <DontListItem>Rely solely on placeholder text as labels</DontListItem>
//   </ul>
//
//   
//   <ul aria-label="Do">
//     <DoListItem>Write clear error messages</DoListItem>
//   </ul>
//   <ul aria-label="Don't">
//     <DontListItem>Use technical jargon in errors</DontListItem>
//   </ul>
//
// Keyboard:
//   - None directly — passive informational display, not interactive
//
// Accessibility:
//   - Semantic <li> element provides list item semantics within the parent list
//   - Screen readers announce list position from the parent <ul> or <ol>
//   - data-recommendation attribute provides a hook for consumer styling
//
// Internationalization:
//   - All content is provided through the children prop
//   - No hardcoded strings in the component
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Should be placed inside a <ul> or <ol> for valid HTML
//   - Consumer can target [data-recommendation="dont"] for visual styling
//
// References:
//   - MDN li element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li
//   - Material Design Do/Don't guidelines: https://m3.material.io/foundations/content-design/style-guide/overview

import React from "react";

export interface DontListItemProps {
    className?: string;
    /** The discouraged-practice content. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function DontListItem({
    className = "",
    children,
    ...restProps
}: DontListItemProps) {
    return (
        <li
        className={`dont-list-item ${className}`}
        data-recommendation="dont"
        {...restProps}
        >
        {children}
        </li>
    );
}
