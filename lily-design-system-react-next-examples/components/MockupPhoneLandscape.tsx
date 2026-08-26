// MockupPhoneLandscape component
// A box area that looks like a mobile phone in landscape orientation.

import React from "react";

export interface MockupPhoneLandscapeProps {
    className?: string;
    label: string;
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function MockupPhoneLandscape({
    className = "",
    label,
    children,
    ...restProps
}: MockupPhoneLandscapeProps) {
    return (
        <div className={`mockup-phone-landscape ${className}`} role="img" aria-label={label} {...restProps}>{children}</div>
    );
}
