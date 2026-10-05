// Mark component
//
// A headless inline wrapper: an inline highlight marking text as relevant or referenced, such as a search match, using the native mark element. Contract: a plain wrapper with the base class and children.
// Draws nothing and carries no strings of its own; the consumer supplies the text.

import React from "react";

export interface MarkProps {
    className?: string;

    /** The content. */
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function Mark({
    className = "",

    children,
    ...restProps
}: MarkProps) {
    return (
        <mark
            className={`mark ${className}`}

            {...restProps}
        >
            {children}
        </mark>
    );
}
