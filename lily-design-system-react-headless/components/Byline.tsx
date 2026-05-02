// Byline component
//
// Author attribution with optional publish and update timestamps. Renders
// a <div> containing the author content (children) plus two named slots —
// `published` and `updated` — that the consumer fills with <time> elements.
// Inspired by the Reuters Graphics Byline pattern.
//
// Props:
//   className — string, optional. CSS class name.
//   children — ReactNode, required. Author names/links.
//   published — ReactNode, optional. Publish date/time (typically a <time>).
//   updated — ReactNode, optional. Last updated date/time (typically a <time>).
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Use rel="author" on author links so RDFa/microformats consumers can
//     extract the author

import React from "react";

export interface BylineProps {
    className?: string;
    /** Author names/links. */
    children: React.ReactNode;
    /** Publish date/time, typically a <time datetime="..."> element. */
    published?: React.ReactNode;
    /** Last updated date/time, typically a <time datetime="..."> element. */
    updated?: React.ReactNode;
    [key: string]: unknown;
}

export default function Byline({
    className = "",
    children,
    published = undefined,
    updated = undefined,
    ...restProps
}: BylineProps) {
    return (
        <div
            className={`byline ${className}`}
            {...restProps}
        >
            <span className="byline-authors">{children}</span>
            {published !== undefined && (
                <span className="byline-published">{published}</span>
            )}
            {updated !== undefined && (
                <span className="byline-updated">{updated}</span>
            )}
        </div>
    );
}
