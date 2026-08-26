// GoToPreviousSection component
// A link that takes users to the previous section of the current page.

import React from "react";

export interface GoToPreviousSectionProps {
    className?: string;
    label: string;
    href: string;
    [key: string]: unknown;
}

export default function GoToPreviousSection({
    className = "",
    label,
    href,
    ...restProps
}: GoToPreviousSectionProps) {
    return (
        <a className={`go-to-previous-section ${className}`} href={href} aria-label={label} {...restProps}>{label}</a>
    );
}
