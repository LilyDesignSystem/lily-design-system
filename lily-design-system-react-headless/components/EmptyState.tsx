// EmptyState component
//
// A headless container for "nothing here yet" content. Heading, text and
// actions are supplied by the consumer as children; no icon is bundled.
//
// Props:
//   className -- string, optional. CSS class name.
//   label -- string, optional. When given: role="group" + aria-label.
//   children -- ReactNode. Consumer content.
//   ...restProps -- spread onto the root <div>.
//
// Accessibility: not a live region; role="group" only when labelled.

import React from "react";

export interface EmptyStateProps {
    className?: string;
    /** Optional accessible label; adds role="group". */
    label?: string;
    /** Consumer content. */
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function EmptyState({
    className = "",
    label = undefined,
    children,
    ...restProps
}: EmptyStateProps) {
    return (
        <div
            className={`empty-state ${className}`}
            role={label ? "group" : undefined}
            aria-label={label}
            {...restProps}
        >
            {children}
        </div>
    );
}
