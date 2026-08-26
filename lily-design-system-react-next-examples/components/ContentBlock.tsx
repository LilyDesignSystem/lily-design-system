// ContentBlock component
//
// ContentBlock for the Reuters-graphics-style article layout family. Renders a
// <div> that consumers style; this component is a structural
// wrapper only. Sets data-width based on the width prop so consumer CSS can target presets.
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Sets the content-block class as the styling hook

import React from "react";

export interface ContentBlockProps {
    className?: string;
    /** Content width preset. */
    width?: "narrower" | "narrow" | "normal" | "wide" | "wider" | "widest" | "fluid";
    /** Component content. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function ContentBlock({
    className = "", width = "normal", children, ...restProps
}: ContentBlockProps) {
    return (
        <div
            className={`content-block ${className}`}
            data-width={width}
            {...restProps}
        >
            {children}
        </div>
    );
}
