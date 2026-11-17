// SectionHeading component
//
// A styled heading introducing a major content section, with optional
// eyebrow and subtitle. Renders a semantic <header> wrapping an
// <h{level}> and optional eyebrow/subtitle paragraphs.
//
// Props:
//   class   — string, optional. CSS class name appended to root.
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

import { dynamic, type JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export type SectionHeadingLevel = 2 | 3 | 4 | 5 | 6;

export interface SectionHeadingProps {
    class?: string;
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

export default function SectionHeading(props: SectionHeadingProps) {
    const p = withDefaults({ class: "" as const, level: 2 }, props);
    const restProps = omit(p, "class", "heading", "eyebrow", "subtitle", "level");
    const HeadingTag = dynamic(() => `h${p.level}` as keyof JSX.IntrinsicElements);
    return (
        <header
            class={`section-heading ${p.class}`}
            {...restProps}
        >
            {p.eyebrow && <p class="section-heading-eyebrow">{p.eyebrow}</p>}
            <HeadingTag class="section-heading-heading">{p.heading}</HeadingTag>
            {p.subtitle && <p class="section-heading-subtitle">{p.subtitle}</p>}
        </header>
    );
}
