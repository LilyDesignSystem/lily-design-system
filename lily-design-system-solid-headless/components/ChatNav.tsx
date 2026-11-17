// ChatNav component
//
// A navigation container for chat information.
//
// Props:
//   class — string, optional. CSS class name.
//   label    — string, required. Accessible label via aria-label.
//   children — ReactNode, required. Component content.
//   ...restProps — additional HTML attributes spread onto the <nav>.
//
// Accessibility:
//   - native <nav> semantics
//   - aria-label exposes a screen-reader name when label is provided
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//
// References:
//   - HTML nav element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
import { warnMissingName } from "./dev-warning";

export interface ChatNavProps {
    class?: string;
    /** Accessible label set on aria-label. */
    label: string;
    /** Component content. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function ChatNav(props: ChatNavProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "children");
    warnMissingName("ChatNav", p.label, p["aria-label"], p["aria-labelledby"]);
    return (
        <nav
            class={`chat-nav ${p.class}`}
            aria-label={p.label}
            {...restProps}
        >
            {p.children}
        </nav>
    );
}
