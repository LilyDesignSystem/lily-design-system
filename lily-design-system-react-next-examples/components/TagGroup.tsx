// TagGroup component
//
// A headless container for a collection of related tags. Renders a <div>
// with the ARIA group role and an accessible label to semantically associate
// tag elements, making the collection understandable to assistive technologies.
// Useful for displaying categories, skills, technologies, or any set of labels
// that belong together.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name for the group via aria-label.
//   children — ReactNode, required. Tag elements to render inside the group.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <TagGroup label="Technologies">...</TagGroup>
//
// Examples:
//   
//   <TagGroup label="Technologies">
//     <Tag label="Technology">React</Tag>
//     <Tag label="Technology">TypeScript</Tag>
//   </TagGroup>
//
// Keyboard:
//   - None -- passive container; keyboard behavior depends on child elements
//
// Accessibility:
//   - role="group" identifies the container as a semantic grouping of related elements
//   - aria-label={label} provides an accessible name describing the tag collection
//
// Internationalization:
//   - The label prop accepts any translated string
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - Consumer provides individual Tag elements as children
//
// References:
//   - WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group

import React from "react";

export interface TagGroupProps {
    className?: string;
    /** Accessible label. */
    label: string;
    /** Tag elements. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function TagGroup({
    className = "",
    label,
    children,
    ...restProps
}: TagGroupProps) {
    return (
        <div
        className={`tag-group ${className}`}
        role="group"
        aria-label={label}
        {...restProps}
        >
        {children}
        </div>
    );
}
