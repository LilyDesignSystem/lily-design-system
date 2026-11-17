// Blockquote component
//
// A block-level quotation with an optional source citation. Renders a
// semantic <blockquote> element with an optional cite URL and an optional
// visible citation footer.
//
// Props:
//   class    — string, optional. CSS class name appended to the root.
//   cite         — string, optional. URL of the source (rendered as the
//                  cite attribute on the <blockquote>).
//   citationText — string, optional. Visible attribution text rendered
//                  inside a <footer> (e.g., "— Author Name, Source").
//   label        — string, optional. aria-label override.
//   children     — ReactNode, optional. The quotation content.
//   ...restProps — additional HTML attributes spread onto the root.
//
// Syntax:
//   <Blockquote
//     cite="https://example.com/source"
//     citationText="— Jane Doe, The Source"
//   >
//     Quotation content here.
//   </Blockquote>
//
// Accessibility:
//   - Uses a semantic <blockquote> element
//   - Optional aria-label overrides the implicit accessible name
//
// Internationalization:
//   - All visible text (children, citationText, label) is consumer-supplied
//
// Claude rules:
//   - Headless: no CSS, no styles
//
// References:
//   - MDN <blockquote>: https://developer.mozilla.org/docs/Web/HTML/Element/blockquote

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface BlockquoteProps {
    class?: string;
    /** URL of the source (rendered as the cite attribute on the blockquote) */
    cite?: string;
    /** Visible attribution text */
    citationText?: string;
    /** aria-label override */
    label?: string;
    /** Quotation content */
    children?: JSX.Element;
    [key: string]: unknown;
}

export default function Blockquote(props: BlockquoteProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "cite", "citationText", "label", "children");
    return (
        <blockquote
            class={`blockquote ${p.class}`}
            cite={p.cite}
            aria-label={p.label}
            {...restProps}
        >
            {p.children}
            {p.citationText && <footer class="blockquote-citation">{p.citationText}</footer>}
        </blockquote>
    );
}
