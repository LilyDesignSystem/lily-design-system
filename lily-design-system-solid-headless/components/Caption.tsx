// Caption component
//
// A headless caption for providing supplementary text alongside images, videos,
// charts, or other media. Renders as a semantic <figcaption> element, which
// provides an implicit association with a parent <figure> element. Commonly used
// in galleries, product pages, data visualizations, and educational content.
//
// Props:
//   class — string, optional. CSS class name.
//   children — ReactNode, required. The caption text or content to display.
//   ...restProps — additional HTML attributes spread onto the <figcaption>.
//
// Syntax:
//   <Caption>Photo of a sunset over the ocean.</Caption>
//
// Examples:
//
//   <Caption id="chart-caption">Figure 1: Revenue growth over time.</Caption>
//
//
//   <figure>
//     <img src="sunset.jpg" alt="Sunset over the ocean" />
//     <Caption>Photo taken at Malibu beach.</Caption>
//   </figure>
//
// Keyboard:
//   None — this component is a passive container for descriptive text.
//
// Accessibility:
//   - Implicit semantics from <figcaption> — automatically associated with parent <figure>
//   - Can be referenced via id and aria-describedby from other elements
//
// Internationalization:
//   - All text comes through children prop; no hardcoded strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Should be placed inside a <figure> for proper semantic association
//
// References:
//   - MDN figcaption: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figcaption

import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export interface CaptionProps {
    class?: string;
    children: JSX.Element;
    [key: string]: unknown;
}

export default function Caption(props: CaptionProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(p, "class", "children");
    return (
        <figcaption
            class={`caption ${p.class}`}
            {...restProps}
        >
            {p.children}
        </figcaption>
    );
}
