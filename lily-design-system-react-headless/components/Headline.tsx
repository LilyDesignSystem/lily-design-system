// Headline component
//
// A page or article headline composition: a heading at a configurable level
// (default <h1>), with optional `subtitle` (the dek) and `byline` slots
// rendered below it. Wraps everything in a <div class="headline"> so consumer
// CSS can target the whole composition.
//
// Props:
//   className — string, optional. CSS class name.
//   level    — 1 | 2 | 3 | 4 | 5 | 6, default 1. Heading level.
//   children — ReactNode, required. Heading text.
//   subtitle — ReactNode, optional. Subtitle/dek content.
//   byline   — ReactNode, optional. Byline area.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Accessibility:
//   - The chosen heading level appears in the page outline; pick the
//     correct level for where the headline sits in the document
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling

import React from "react";

export interface HeadlineProps {
    className?: string;
    /** Heading level 1-6. */
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    /** Heading text. */
    children: React.ReactNode;
    /** Subtitle / dek content. */
    subtitle?: React.ReactNode;
    /** Byline area. */
    byline?: React.ReactNode;
    [key: string]: unknown;
}

export default function Headline({
    className = "",
    level = 1,
    children,
    subtitle = undefined,
    byline = undefined,
    ...restProps
}: HeadlineProps) {
    const Heading = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    return (
        <div
            className={`headline ${className}`}
            {...restProps}
        >
            <Heading className="headline-heading">{children}</Heading>
            {subtitle !== undefined && (
                <div className="headline-subtitle">{subtitle}</div>
            )}
            {byline !== undefined && (
                <div className="headline-byline">{byline}</div>
            )}
        </div>
    );
}
