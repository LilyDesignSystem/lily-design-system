// Byline component
//
// Author attribution with optional publish and update timestamps. Renders
// a <div> containing the author content (children) plus two named slots —
// `published` and `updated` — that the consumer fills with <time> elements.
// Inspired by the Reuters Graphics Byline pattern.
//
// Props:
//   class — string, optional. CSS class name.
//   children — ReactNode, required. Author names/links.
//   published — ReactNode, optional. Publish date/time (typically a <time>).
//   updated — ReactNode, optional. Last updated date/time (typically a <time>).
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Use rel="author" on author links so RDFa/microformats consumers can
//     extract the author

import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export interface BylineProps {
    class?: string;
    /** Author names/links. */
    children: JSX.Element;
    /** Publish date/time, typically a <time datetime="..."> element. */
    published?: JSX.Element;
    /** Last updated date/time, typically a <time datetime="..."> element. */
    updated?: JSX.Element;
    [key: string]: unknown;
}

export default function Byline(props: BylineProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(p, "class", "children", "published", "updated");
    return (
        <div
            class={`byline ${p.class}`}
            {...restProps}
        >
            <span class="byline-authors">{p.children}</span>
            {p.published !== undefined && <span class="byline-published">{p.published}</span>}
            {p.updated !== undefined && <span class="byline-updated">{p.updated}</span>}
        </div>
    );
}
