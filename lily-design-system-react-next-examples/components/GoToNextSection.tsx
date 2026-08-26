// GoToNextSection component
// A link that takes users to the next section of the current page.

import React from "react";

export interface GoToNextSectionProps {
    className?: string;
    label: string;
    href: string;
    [key: string]: unknown;
}

export default function GoToNextSection({
    className = "",
    label,
    href,
    ...restProps
}: GoToNextSectionProps) {
    return (
        <a className={`go-to-next-section ${className}`} href={href} aria-label={label} {...restProps}>{label}</a>
    );
}
