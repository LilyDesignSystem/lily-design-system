// PhotoPack component
//
// PhotoPack for the Reuters-graphics-style article layout family. Renders a
// <div> (with role="group") that consumers style; this component is a structural
// wrapper only.
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Sets the photo-pack class as the styling hook

import React from "react";

export interface PhotoPackProps {
    className?: string;
    /** Accessible label set on aria-label. */
    label: string;
    /** Component content. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function PhotoPack({
    className = "", label, children, ...restProps
}: PhotoPackProps) {
    return (
        <div
            className={`photo-pack ${className}`}
            role="group"
            aria-label={label}
            {...restProps}
        >
            {children}
        </div>
    );
}
