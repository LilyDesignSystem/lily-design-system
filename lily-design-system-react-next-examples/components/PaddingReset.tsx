// PaddingReset component
//
// PaddingReset for the Reuters-graphics-style article layout family. Renders a
// <div> that consumers style; this component is a structural
// wrapper only.
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Sets the padding-reset class as the styling hook

import React from "react";

export interface PaddingResetProps {
    className?: string;
    /** Component content. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function PaddingReset({
    className = "", children, ...restProps
}: PaddingResetProps) {
    return (
        <div
            className={`padding-reset ${className}`}
            {...restProps}
        >
            {children}
        </div>
    );
}
