// HeroHeadline component
//
// HeroHeadline for the Reuters-graphics-style article layout family. Renders a
// <div> that consumers style; this component is a structural
// wrapper only.
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Sets the hero-headline class as the styling hook

import React from "react";

export interface HeroHeadlineProps {
    className?: string;
    /** Accessible label set on aria-label. */
    label: string;
    /** Background media (image or video). */
    media: React.ReactNode;
    /** Component content. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function HeroHeadline({
    className = "", label, media, children, ...restProps
}: HeroHeadlineProps) {
    return (
        <div
            className={`hero-headline ${className}`}
            aria-label={label}
            {...restProps}
        >
            {media}
            {children}
        </div>
    );
}
