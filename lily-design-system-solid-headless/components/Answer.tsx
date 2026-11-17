// Answer component
//
// An answer is anything that responds to a question, request, action, etc.
//
// Props:
//   class — string, optional. CSS class name.
//   label    — string, optional. Accessible label via aria-label.
//   children — ReactNode, required. Component content.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Accessibility:
//   - aria-label exposes a screen-reader name when label is provided
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface AnswerProps {
    class?: string;
    /** Optional accessible label set on aria-label. */
    label?: string;
    /** Component content. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function Answer(props: AnswerProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "children");
    return (
        <div
            class={`answer ${p.class}`}
            role={p.label ? "group" : undefined}
            aria-label={p.label}
            {...restProps}
        >
            {p.children}
        </div>
    );
}
