// CollectionListItem component
//
// One item in a CollectionList with a required heading and optional image,
// meta, and description fields. When `href` is provided, the heading is
// wrapped in an anchor; otherwise the heading is rendered as plain text.
// Additional content can be supplied via children to extend or replace the
// default body.
//
// Props:
//   class   — string, optional. CSS class name appended to the root.
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

import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export interface CollectionListItemProps {
    class?: string;
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
    children?: JSX.Element;
    [key: string]: unknown;
}

export default function CollectionListItem(props: CollectionListItemProps) {
    const p = withDefaults({ class: "" as const, imageAlt: "" as const }, props);
    const restProps = omit(
        p,
        "class",
        "heading",
        "meta",
        "description",
        "imageUrl",
        "imageAlt",
        "href",
        "label",
        "children",
    );
    return (
        <li
            class={`collection-list-item ${p.class}`}
            aria-label={p.label}
            {...restProps}
        >
            {p.imageUrl && (
                <img
                    class="collection-list-item-image"
                    src={p.imageUrl}
                    alt={p.imageAlt}
                />
            )}
            <h3 class="collection-list-item-heading">
                {p.href ? <a href={p.href}>{p.heading}</a> : p.heading}
            </h3>
            {p.meta && <p class="collection-list-item-meta">{p.meta}</p>}
            {p.description && <p class="collection-list-item-description">{p.description}</p>}
            {p.children}
        </li>
    );
}
