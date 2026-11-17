// Code component
//
// An inline code span for short code snippets within surrounding text.
//
// Props:
//   class — string, optional. CSS class name.
//   children — ReactNode, required. Component content.
//   ...restProps — additional HTML attributes spread onto the <code>.
//
// Accessibility:
//   - native <code> semantics
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//
// References:
//   - HTML code element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/code

import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export interface CodeProps {
    class?: string;
    /** Component content. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function Code(props: CodeProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(p, "class", "children");
    return (
        <code
            class={`code ${p.class}`}
            {...restProps}
        >
            {p.children}
        </code>
    );
}
