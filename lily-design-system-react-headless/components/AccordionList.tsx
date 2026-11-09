// AccordionList component
//
// AccordionList elements within an AccordionNav. Provides an optional
// accessible label for the list.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, optional. Accessible name for the list via aria-label.
//   children — ReactNode, required. AccordionListItem elements.
//   ...restProps — additional HTML attributes spread onto the <ol>.
//
// Syntax:
//   <AccordionNav>
//     <AccordionList>
//       <AccordionListItem>...</AccordionListItem>
//     </AccordionList>
//   </AccordionNav>
//
// Examples:
//   <AccordionNav label="My Nav">
//     <AccordionList label="Questions">
//       <AccordionListItem>
//         <summary>What is this?</summary>
//         <p>A design system.</p>
//       </AccordionListItem>
//     </AccordionList>
//  </AccordionNav>
//
// Keyboard: None — passive container. Keyboard interactions are handled
// by AccordionListItem children.
//
// Accessibility:
//   - An <ol>, so screen readers announce how many sections there are and where each one is; aria-label optionally names it
//
// Internationalization:
//   - The label prop accepts any translated string
//   - No hardcoded text
//
// Claude rules:
//   - Compound component — used inside AccordionNav, contains AccordionListItem children
//   - Headless: no CSS, no styles — consumer provides all styling
//
// References:
//   - HTML ol element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol

import React from "react";

export interface AccordionListProps {
    className?: string;
    /** Optional accessible label for the group. */
    label?: string;
    /** AccordionListItem elements. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function AccordionList({
    className = "",
    label = "",
    children,
    ...restProps
}: AccordionListProps) {
    return (
        <ol
            className={`accordion-list ${className}`}
            aria-label={label || undefined}
            {...restProps}
        >
            {children}
        </ol>
    );
}
