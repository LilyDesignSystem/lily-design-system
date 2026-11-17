// ScreenReaderSpan component
//
// A visually hidden span of text intended for screen readers.
//
// Props:
//   class — string, optional. CSS class name.
//   label    — string, optional. Accessible label via aria-label.
//   children — ReactNode, required. Component content.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Accessibility:
//   - native <span> semantics
//   - aria-label exposes a screen-reader name when label is provided
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//
// References:
//   - HTML span element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span

import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export interface ScreenReaderSpanProps {
    class?: string;
    /** Component content. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function ScreenReaderSpan(props: ScreenReaderSpanProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(p, "class", "children");
    return (
        <span
            class={`screen-reader-span ${p.class}`}
            {...restProps}
        >
            {p.children}
        </span>
    );
}
