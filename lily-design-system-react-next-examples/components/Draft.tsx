// Draft component
//
// A passive container marking content that is unpublished or in progress. The
// consumer supplies the draft body as children and optionally a status string
// describing the stage of the draft, which is reflected as a data-status
// attribute the consumer's CSS or JS can observe.
//
// Props:
//   className — string, optional. CSS class name.
//   label    — string, optional. Accessible label via aria-label.
//   status   — string, optional. Stage of the draft, reflected as data-status.
//   children — ReactNode, required. Component content.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Accessibility:
//   - aria-label exposes a screen-reader name when label is provided
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - status is exposed via data-status, not ARIA — it's for the consumer

import React from "react";

export interface DraftProps {
    className?: string;
    /** Optional accessible label set on aria-label. */
    label?: string;
    /** Optional draft stage, reflected as data-status. */
    status?: string;
    /** Component content. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function Draft({
    className = "",
    label = undefined,
    status = undefined,
    children,
    ...restProps
}: DraftProps) {
    return (
        <div
            className={`draft ${className}`}
            aria-label={label}
            data-status={status}
            {...restProps}
        >
            {children}
        </div>
    );
}
