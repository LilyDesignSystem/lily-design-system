// BodyText component
//
// BodyText for the Reuters-graphics-style article layout family. Renders a
// <div> that consumers style; this component is a structural
// wrapper only.
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Sets the body-text class as the styling hook

import React from "react";

export interface BodyTextProps {
    className?: string;
    /** Component content. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function BodyText({
    className = "", children, ...restProps
}: BodyTextProps) {
    return (
        <div
            className={`body-text ${className}`}
            {...restProps}
        >
            {children}
        </div>
    );
}
