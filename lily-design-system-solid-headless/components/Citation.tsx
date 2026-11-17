// Citation component
//
// A citation that acknowledges the relevance of another work.
//
// Props:
//   class — string, optional. CSS class name.
//   label    — string, optional. Hidden text read before the citation.
//   children — ReactNode, required. Component content.
//   ...restProps — additional HTML attributes spread onto the <cite>.
//
// Accessibility:
//   - native <cite> semantics
//   - hidden text comes from `label` when given
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//
// References:
//   - HTML cite element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/cite

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface CitationProps {
    class?: string;
    /** Hidden text read before the citation. */
    label?: string;
    /** Component content. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function Citation(props: CitationProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "children");
    return (
        <cite
            class={`citation ${p.class}`}
            {...restProps}
        >
            {p.label ? <span class="screen-reader-span">{`${p.label} `}</span> : null}
            {p.children}
        </cite>
    );
}
