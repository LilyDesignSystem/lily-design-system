// EndNotes component
//
// EndNotes for the Reuters-graphics-style article layout family. Renders a
// <section> that consumers style; this component is a structural
// wrapper only.
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Sets the end-notes class as the styling hook

import React from "react";

export interface EndNotesProps {
    className?: string;
    /** Optional accessible label set on aria-label. Defaults to 'End notes'. */
    label?: string;
    /** Component content. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function EndNotes({
    className = "", label = "End notes", children, ...restProps
}: EndNotesProps) {
    return (
        <section
            className={`end-notes ${className}`}
            aria-label={label}
            {...restProps}
        >
            {children}
        </section>
    );
}
