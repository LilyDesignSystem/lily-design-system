// CollectionList component
//
// A compact list of multiple related items such as articles, events, or
// resources. Renders an unordered list (<ul>) so the children are exposed
// with native list semantics. Each child should be a CollectionListItem.
// The optional label provides an accessible name for the list when needed.
//
// Props:
//   className — string, optional. CSS class name appended to the root.
//   label     — string, optional. aria-label for the list.
//   children  — ReactNode, required. CollectionListItem children.
//   ...restProps — additional HTML attributes spread onto the <ul>.
//
// Syntax:
//   <CollectionList label="Recent articles">
//     <CollectionListItem heading="Article one" />
//     <CollectionListItem heading="Article two" />
//   </CollectionList>
//
// Accessibility:
//   - The native <ul> provides list semantics
//   - aria-label provides an optional accessible name
//
// Internationalization:
//   - All user-facing text is consumer-supplied via the label prop
//
// Claude rules:
//   - Headless: no CSS, no styles
//   - label is optional
//
// References:
//   - USWDS Collection: https://designsystem.digital.gov/components/collection/

import React from "react";

export interface CollectionListProps {
    className?: string;
    /** Optional aria-label for the list */
    label?: string;
    /** CollectionListItem children */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function CollectionList({
    className = "",
    label,
    children,
    ...restProps
}: CollectionListProps) {
    return (
        <ul
        className={`collection-list ${className}`}
        aria-label={label}
        {...restProps}
        >
        {children}
        </ul>
    );
}
