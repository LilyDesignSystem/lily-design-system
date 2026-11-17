// FeatureCard component
//
// A large content card with a prominent image positioned alongside or
// above the text. Renders an <article> landmark with a heading, optional
// description, optional image, and a children slot for CTAs or extras.
//
// Props:
//   class     — string, optional. CSS class name appended to the root.
//   heading       — string, REQUIRED. Card heading.
//   imagePosition — "start" | "end" | "top", default "start". Image
//                   placement (exposed as data-image-position).
//   imageUrl      — string, optional. Image source URL.
//   imageAlt      — string, optional. Alt text for the image.
//   description   — string, optional. Body text.
//   label         — string, optional. aria-label override (defaults to
//                   heading).
//   children      — ReactNode, optional. Additional content (e.g., CTAs).
//   ...restProps  — additional HTML attributes spread onto the root.
//
// Syntax:
//   <FeatureCard
//     heading="Privacy first"
//     description="Designed to protect your data."
//     imageUrl="/images/feature.png"
//     imageAlt="Lock illustration"
//     imagePosition="start"
//   >
//     <a href="/learn-more">Learn more</a>
//   </FeatureCard>
//
// Accessibility:
//   - Uses an <article> landmark with aria-label
//   - Image alt text is consumer-provided
//
// Internationalization:
//   - All user-facing strings are consumer-supplied
//
// Claude rules:
//   - Headless: no CSS, no styles
//   - heading is non-optional in the interface

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
import { attr } from "./attr";
export interface FeatureCardProps {
    class?: string;
    /** Card heading */
    heading: string;
    /** Image placement relative to text */
    imagePosition?: "start" | "end" | "top";
    /** Image source URL */
    imageUrl?: string;
    /** Image alt text */
    imageAlt?: string;
    /** Body text */
    description?: string;
    /** aria-label override; defaults to heading */
    label?: string;
    /** Additional content (e.g., CTAs) */
    children?: JSX.Element;
    [key: string]: unknown;
}

export default function FeatureCard(props: FeatureCardProps) {
    const p = merge({ class: "" as const, imagePosition: "start" as const }, props);
    const restProps = omit(
        p,
        "class",
        "heading",
        "imagePosition",
        "imageUrl",
        "imageAlt",
        "description",
        "label",
        "children",
    );
    return (
        <article
            class={`feature-card ${p.class}`}
            data-image-position={attr(p.imagePosition)}
            aria-label={p.label ?? p.heading}
            {...restProps}
        >
            {p.imageUrl && (
                <img
                    class="feature-card-image"
                    src={p.imageUrl}
                    alt={p.imageAlt ?? ""}
                />
            )}
            <header class="feature-card-header">
                <h3 class="feature-card-heading">{p.heading}</h3>
            </header>
            {p.description && <p class="feature-card-description">{p.description}</p>}
            {p.children}
        </article>
    );
}
