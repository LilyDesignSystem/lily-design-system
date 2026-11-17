// ChatListItem component
//
// One chat list item, typically containing a chat message.
//
// Props:
//   class — string, optional. CSS class name.
//   label    — string, optional. Accessible label via aria-label.
//   children — ReactNode, required. Component content.
//   ...restProps — additional HTML attributes spread onto the <li>.
//
// Accessibility:
//   - native <li> semantics
//   - aria-label exposes a screen-reader name when label is provided
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//
// References:
//   - HTML li element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
import { attr } from "./attr";
export interface ChatListItemProps {
    class?: string;
    /** Optional accessible label set on aria-label. */
    label?: string;
    /** Marks the currently selected conversation (aria-current="true"). */
    current?: boolean;
    /** Component content. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function ChatListItem(props: ChatListItemProps) {
    const p = merge({ class: "" as const, current: false }, props);
    const restProps = omit(p, "class", "label", "current", "children");
    return (
        <li
            class={`chat-list-item ${p.class}`}
            aria-label={p.label}
            aria-current={attr(p.current ? "true" : undefined)}
            {...restProps}
        >
            {p.children}
        </li>
    );
}
