// Flair component
//
// A small inline element used to add visual emphasis, categorization, or status
// labeling to elements within an interface. Commonly used as tags, badges, or labels
// in forums, social platforms, or dashboards to indicate user roles, content types,
// statuses, or categories (e.g., "Moderator", "Urgent", "New").
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, default undefined. Accessible label; omit for decorative flair, provide for meaningful flair.
//   children — ReactNode, required. Flair content text.
//   ...restProps — additional HTML attributes spread onto the span.
//
// Syntax:
//   <Flair>New</Flair>
//
// Examples:
//   
//   <Flair>New</Flair>
//
//   
//   <Flair label="Status: new">New</Flair>
//
// Keyboard:
//   - None — this is a passive inline display element
//
// Accessibility:
//   - aria-hidden="true" applied when no label is provided, marking the flair as decorative
//   - aria-label applied when label is provided, giving the flair an accessible name
//
// Internationalization:
//   - All text content comes through the children prop and label prop; no hardcoded strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - When no label is provided, the flair is treated as decorative via aria-hidden
//   - When label is provided, aria-hidden is removed and the flair becomes meaningful

import React from "react";

export interface FlairProps {
    className?: string;
    /** Accessible label (omit for decorative). */
    label?: string;
    /** Flair content. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function Flair({
    className = "",
    label = undefined,
    children,
    ...restProps
}: FlairProps) {
    return (
        <span
        className={`flair ${className}`}
        aria-label={label}
        aria-hidden={label ? undefined : "true"}
        {...restProps}
        >
        {children}
        </span>
    );
}
