// CodeBlock component
//
// A block of formatted code with optional line numbers and line highlighting.
//
// Props:
//   class — string, optional. CSS class name.
//   label    — string, optional. Names the block, which becomes role="region".
//   children — ReactNode, required. Component content.
//   ...restProps — additional HTML attributes spread onto the <pre>.
//
// Accessibility:
//   - native <pre> semantics
//   - role="region" and aria-label come from `label` when given
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//
// References:
//   - HTML pre element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/pre

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface CodeBlockProps {
    class?: string;
    /** Names the block, which becomes role="region". */
    label?: string;
    /** Component content. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function CodeBlock(props: CodeBlockProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "children");
    return (
        <pre
            class={`code-block ${p.class}`}
            role={p.label ? "region" : undefined}
            aria-label={p.label}
            {...restProps}
        >
            {p.children}
        </pre>
    );
}
