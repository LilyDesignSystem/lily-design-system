// IconList component
//
// An ordered list (rendered as <ul>) of icon list item components. Each child
// should typically be an IconListItem with a leading icon slot and text.
// Inspired by the USWDS Icon list component.
//
// Props:
//   className — string, optional. CSS class name appended to the root.
//   label     — string, optional. aria-label for the list.
//   children  — ReactNode, required. IconListItem children.
//   ...restProps — additional HTML attributes spread onto the <ul>.
//
// Syntax:
//   <IconList label="Benefits">
//     <IconListItem icon={<Check />}>Easy to use</IconListItem>
//   </IconList>
//
// Accessibility:
//   - The native <ul> provides list semantics
//   - aria-label provides an optional accessible name
//
// Internationalization:
//   - All user-facing text is consumer-supplied via props
//
// Claude rules:
//   - Headless: no CSS, no styles
//   - label is optional
//
// References:
//   - USWDS Icon list: https://designsystem.digital.gov/components/icon-list/

import React from "react";

export interface IconListProps {
    className?: string;
    /** Optional aria-label for the list */
    label?: string;
    /** IconListItem children */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function IconList({
    className = "",
    label,
    children,
    ...restProps
}: IconListProps) {
    return (
        <ul
        className={`icon-list ${className}`}
        aria-label={label}
        {...restProps}
        >
        {children}
        </ul>
    );
}
