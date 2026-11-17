// ChatList component
//
// An ordered list of chat list items.
//
// Props:
//   class — string, optional. CSS class name.
//   label    — string, optional. Accessible label via aria-label.
//   children — ReactNode, required. Component content.
//   ...restProps — additional HTML attributes spread onto the <ol>.
//
// Accessibility:
//   - native <ol> semantics
//   - aria-label exposes a screen-reader name when label is provided
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//
// References:
//   - HTML ol element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface ChatListProps {
    class?: string;
    /** Optional accessible label set on aria-label. */
    label?: string;
    /** Component content. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function ChatList(props: ChatListProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "children");
    return (
        <ol
            class={`chat-list ${p.class}`}
            aria-label={p.label}
            {...restProps}
        >
            {p.children}
        </ol>
    );
}
