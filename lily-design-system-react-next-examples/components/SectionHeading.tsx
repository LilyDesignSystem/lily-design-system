// SectionHeading component
//
// A styled heading introducing a major content section, with optional
// eyebrow and subtitle. Renders a semantic <header> wrapping an
// <h{level}> and optional eyebrow/subtitle paragraphs.
//
// Props:
//   className   — string, optional. CSS class name appended to root.
//   heading     — string, REQUIRED. Main heading text.
//   eyebrow     — string, optional. Eyebrow text rendered above the
//                 heading.
//   subtitle    — string, optional. Subtitle text below the heading.
//   level       — 2 | 3 | 4 | 5 | 6, default 2. Heading level
//                 (renders <h2>–<h6>).
//   ...restProps — additional HTML attributes spread onto the root.
//
// Syntax:
//   <SectionHeading
//     eyebrow="Features"
//     heading="Why choose us"
//     subtitle="A short tagline."
//     level={2}
//   />
//
// Accessibility:
//   - <header> landmark inside the section
//   - Heading element provides hierarchical semantics
//
// Internationalization:
//   - All user-facing strings are consumer-supplied
//
// Claude rules:
//   - Headless: no CSS, no styles
//   - heading is non-optional in the interface

import React from "react";

export type SectionHeadingLevel = 2 | 3 | 4 | 5 | 6;

export interface SectionHeadingProps {
    className?: string;
    /** Main heading text */
    heading: string;
    /** Eyebrow text rendered above the heading */
    eyebrow?: string;
    /** Subtitle text rendered below the heading */
    subtitle?: string;
    /** Heading level (h2–h6) */
    level?: SectionHeadingLevel;
    [key: string]: unknown;
}

export default function SectionHeading({
    className = "",
    heading,
    eyebrow = undefined,
    subtitle = undefined,
    level = 2,
    ...restProps
}: SectionHeadingProps) {
    const HeadingTag = `h${level}` as keyof React.JSX.IntrinsicElements;
    return (
        <header className={`section-heading ${className}`} {...restProps}>
            {eyebrow && (
                <p className="section-heading-eyebrow">{eyebrow}</p>
            )}
            <HeadingTag className="section-heading-heading">{heading}</HeadingTag>
            {subtitle && (
                <p className="section-heading-subtitle">{subtitle}</p>
            )}
        </header>
    );
}
