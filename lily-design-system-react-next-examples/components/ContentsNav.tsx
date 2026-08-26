// ContentsNav component
//
// A headless navigation landmark for a table of contents. Renders a semantic
// <nav> element with an accessible label. Designed to wrap a ContentsList and
// ContentsListItem children. Commonly used at the top of documentation pages,
// articles, or forms with multiple sections.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name for the navigation landmark (e.g., "Contents").
//   children — ReactNode, required. Typically a ContentsList component.
//   ...restProps — additional HTML attributes spread onto the <nav>.
//
// Syntax:
//   <ContentsNav label="Contents">
//     <ContentsList>
//       <ContentsListItem><a href="#section">Section</a></ContentsListItem>
//     </ContentsList>
//   </ContentsNav>
//
// Examples:
//   
//   <ContentsNav label="On this page">
//     <ContentsList>
//       <ContentsListItem><a href="#introduction">Introduction</a></ContentsListItem>
//       <ContentsListItem><a href="#usage">Usage</a></ContentsListItem>
//       <ContentsListItem><a href="#examples">Examples</a></ContentsListItem>
//     </ContentsList>
//   </ContentsNav>
//
// Keyboard:
//   - None — passive navigation container; keyboard navigation handled by anchor links within items
//
// Accessibility:
//   - aria-label on <nav> provides an accessible name, distinguishing it from other nav regions
//
// Internationalization:
//   - The label prop provides the accessible name; no hardcoded strings
//   - All link text is provided by consumers through children
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Compound component: parent container for ContentsList and ContentsListItem children
//
// References:
//   - WAI-ARIA Navigation Landmark: https://www.w3.org/WAI/ARIA/apd/practices/landmark-regions/
//   - MDN nav element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav

import React from "react";

export interface ContentsNavProps {
    className?: string;
    /** Accessible label */
    label?: string;
    /** The component content */
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function ContentsNav({
    className = "",
    label,
    children,
    ...restProps
}: ContentsNavProps) {
    return (
        <nav
        className={`contents-nav ${className}`}
        aria-label={label}
        {...restProps}
        >
        {children}
        </nav>
    );
}
