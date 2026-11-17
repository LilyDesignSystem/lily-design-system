// Pictogram component
//
// An icon-based component pairing an icon with a title and description in
// a centered or side layout. Renders a semantic <figure> with the icon
// in an aria-hidden wrapper and the heading/description inside a
// <figcaption>.
//
// Props:
//   class   — string, optional. CSS class name appended to root.
//   layout      — "centered" | "side", default "centered". Icon position
//                 relative to content (exposed via data-layout).
//   heading     — string, optional. Title text (rendered as <h3>).
//   description — string, optional. Body text (rendered as <p>).
//   icon        — ReactNode, REQUIRED. The icon/illustration node.
//   label       — string, optional. aria-label override.
//   children    — ReactNode, optional. Additional content (overrides
//                 description if provided).
//   ...restProps — additional HTML attributes spread onto the root.
//
// Syntax:
//   <Pictogram
//     icon={<MyIcon />}
//     heading="Privacy"
//     description="We respect your data."
//   />
//
// Accessibility:
//   - Uses a semantic <figure> with optional aria-label
//   - Icon wrapper is aria-hidden (decorative)
//   - Accessible name comes from heading or label
//
// Internationalization:
//   - All user-facing strings are consumer-supplied
//
// Claude rules:
//   - Headless: no CSS, no styles
//   - icon is non-optional in the interface
//   - icon is a ReactNode prop, NOT children

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
import { attr } from "./attr";
export interface PictogramProps {
    class?: string;
    /** Icon position relative to content */
    layout?: "centered" | "side";
    /** Title text */
    heading?: string;
    /** Body text */
    description?: string;
    /** Icon node (required) */
    icon: JSX.Element;
    /** aria-label override */
    label?: string;
    /** Additional content (overrides description if provided) */
    children?: JSX.Element;
    [key: string]: unknown;
}

export default function Pictogram(props: PictogramProps) {
    const p = merge({ class: "" as const, layout: "centered" as const }, props);
    const restProps = omit(
        p,
        "class",
        "layout",
        "heading",
        "description",
        "icon",
        "label",
        "children",
    );
    return (
        <figure
            class={`pictogram ${p.class}`}
            data-layout={attr(p.layout)}
            aria-label={p.label}
            {...restProps}
        >
            <div
                class="pictogram-icon"
                aria-hidden="true"
            >
                {p.icon}
            </div>
            <figcaption class="pictogram-caption">
                {p.heading && <h3 class="pictogram-heading">{p.heading}</h3>}
                {p.children
                    ? p.children
                    : p.description && <p class="pictogram-description">{p.description}</p>}
            </figcaption>
        </figure>
    );
}
