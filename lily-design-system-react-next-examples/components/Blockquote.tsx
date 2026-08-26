// Blockquote component
//
// A block-level quotation with an optional source citation. Renders a
// semantic <blockquote> element with an optional cite URL and an optional
// visible citation footer.
//
// Props:
//   className    — string, optional. CSS class name appended to the root.
//   cite         — string, optional. URL of the source (rendered as the
//                  cite attribute on the <blockquote>).
//   citationText — string, optional. Visible attribution text rendered
//                  inside a <footer> (e.g., "— Author Name, Source").
//   label        — string, optional. aria-label override.
//   children     — ReactNode, optional. The quotation content.
//   ...restProps — additional HTML attributes spread onto the root.
//
// Syntax:
//   <Blockquote
//     cite="https://example.com/source"
//     citationText="— Jane Doe, The Source"
//   >
//     Quotation content here.
//   </Blockquote>
//
// Accessibility:
//   - Uses a semantic <blockquote> element
//   - Optional aria-label overrides the implicit accessible name
//
// Internationalization:
//   - All visible text (children, citationText, label) is consumer-supplied
//
// Claude rules:
//   - Headless: no CSS, no styles
//
// References:
//   - MDN <blockquote>: https://developer.mozilla.org/docs/Web/HTML/Element/blockquote

import React from "react";

export interface BlockquoteProps {
    className?: string;
    /** URL of the source (rendered as the cite attribute on the blockquote) */
    cite?: string;
    /** Visible attribution text */
    citationText?: string;
    /** aria-label override */
    label?: string;
    /** Quotation content */
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function Blockquote({
    className = "",
    cite = undefined,
    citationText = undefined,
    label = undefined,
    children,
    ...restProps
}: BlockquoteProps) {
    return (
        <blockquote
            className={`blockquote ${className}`}
            cite={cite}
            aria-label={label}
            {...restProps}
        >
            {children}
            {citationText && (
                <footer className="blockquote-citation">{citationText}</footer>
            )}
        </blockquote>
    );
}
