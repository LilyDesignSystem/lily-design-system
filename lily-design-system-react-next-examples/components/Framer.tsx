// Framer component
//
// Framer for the Reuters-graphics-style article layout family. Renders a
// <div> that consumers style; this component is a structural
// wrapper only.
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Sets the framer class as the styling hook

import React from "react";

export interface FramerProps {
    className?: string;
    /** Optional accessible label set on aria-label. */
    label?: string;
    /** Component content. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function Framer({
    className = "", label = undefined, children, ...restProps
}: FramerProps) {
    return (
        <div
            className={`framer ${className}`}
            aria-label={label}
            {...restProps}
        >
            {children}
        </div>
    );
}
