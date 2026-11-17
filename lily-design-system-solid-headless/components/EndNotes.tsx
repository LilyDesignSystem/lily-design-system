// EndNotes component
//
// EndNotes for the Reuters-graphics-style article layout family. Renders a
// <section> that consumers style; this component is a structural
// wrapper only.
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Sets the end-notes class as the styling hook

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface EndNotesProps {
    class?: string;
    /** Optional accessible label set on aria-label. Defaults to 'End notes'. */
    label: string;
    /** Component content. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function EndNotes(props: EndNotesProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "children");
    return (
        <section
            class={`end-notes ${p.class}`}
            aria-label={p.label}
            {...restProps}
        >
            {p.children}
        </section>
    );
}
