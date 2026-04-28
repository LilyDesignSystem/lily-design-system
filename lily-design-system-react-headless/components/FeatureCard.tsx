// FeatureCard component
//
// A large content card with a prominent image positioned alongside or
// above the text. Renders an <article> landmark with a heading, optional
// description, optional image, and a children slot for CTAs or extras.
//
// Props:
//   className     — string, optional. CSS class name appended to the root.
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

import React from "react";

export interface FeatureCardProps {
    className?: string;
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
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function FeatureCard({
    className = "",
    heading,
    imagePosition = "start",
    imageUrl = undefined,
    imageAlt = undefined,
    description = undefined,
    label = undefined,
    children,
    ...restProps
}: FeatureCardProps) {
    return (
        <article
            className={`feature-card ${className}`}
            data-image-position={imagePosition}
            aria-label={label ?? heading}
            {...restProps}
        >
            {imageUrl && (
                <img
                    className="feature-card-image"
                    src={imageUrl}
                    alt={imageAlt ?? ""}
                />
            )}
            <header className="feature-card-header">
                <h3 className="feature-card-heading">{heading}</h3>
            </header>
            {description && (
                <p className="feature-card-description">{description}</p>
            )}
            {children}
        </article>
    );
}
