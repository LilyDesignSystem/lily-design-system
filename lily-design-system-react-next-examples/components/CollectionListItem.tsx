// CollectionListItem component
//
// One item in a CollectionList with a required heading and optional image,
// meta, and description fields. When `href` is provided, the heading is
// wrapped in an anchor; otherwise the heading is rendered as plain text.
// Additional content can be supplied via children to extend or replace the
// default body.
//
// Props:
//   className   — string, optional. CSS class name appended to the root.
//   heading     — string, REQUIRED. Item heading.
//   meta        — string, optional. Meta line (e.g., date or category).
//   description — string, optional. Body text.
//   imageUrl    — string, optional. Thumbnail image src.
//   imageAlt    — string, optional. Image alt text.
//   href        — string, optional. When provided, heading is wrapped in <a>.
//   label       — string, optional. aria-label override.
//   children    — ReactNode, optional. Additional content rendered after defaults.
//   ...restProps — additional HTML attributes spread onto the <li>.
//
// Syntax:
//   <CollectionListItem
//     heading="Article title"
//     meta="2026-04-27"
//     description="Lorem ipsum…"
//     href="/articles/1"
//   />
//
// Accessibility:
//   - The native <li> provides list-item semantics
//   - When href is provided the heading is a link
//   - aria-label optionally overrides the accessible name
//
// Internationalization:
//   - All user-facing text is consumer-supplied via props
//
// Claude rules:
//   - Headless: no CSS, no styles
//   - heading is non-optional in the interface
//   - <a> renders only when href is provided
//
// References:
//   - USWDS Collection: https://designsystem.digital.gov/components/collection/

import React from "react";

export interface CollectionListItemProps {
    className?: string;
    /** Item heading (required) */
    heading: string;
    /** Optional meta line, e.g. date or category */
    meta?: string;
    /** Optional body text */
    description?: string;
    /** Optional thumbnail image src */
    imageUrl?: string;
    /** Optional image alt text */
    imageAlt?: string;
    /** When provided, heading is wrapped in <a> */
    href?: string;
    /** Optional aria-label override */
    label?: string;
    /** Additional content rendered after defaults */
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function CollectionListItem({
    className = "",
    heading,
    meta,
    description,
    imageUrl,
    imageAlt = "",
    href,
    label,
    children,
    ...restProps
}: CollectionListItemProps) {
    return (
        <li
        className={`collection-list-item ${className}`}
        aria-label={label}
        {...restProps}
        >
        {imageUrl && (
            <img
            className="collection-list-item-image"
            src={imageUrl}
            alt={imageAlt}
            />
        )}
        <h3 className="collection-list-item-heading">
            {href ? <a href={href}>{heading}</a> : heading}
        </h3>
        {meta && <p className="collection-list-item-meta">{meta}</p>}
        {description && (
            <p className="collection-list-item-description">{description}</p>
        )}
        {children}
        </li>
    );
}
