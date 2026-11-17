// SectionListItem component
//
// One item in a SectionList. Renders an <li> with the `section-list-item` hook.
//
// Props:
//   class — string, optional. CSS class name.
//   children — JSX.Element, required. The content.
//   ...restProps — additional HTML attributes spread onto the root <li>.
//
// Syntax:
//   <SectionListItem current>…</SectionListItem>
//
// Examples:
//   <SectionListItem current><a href="#one" aria-current="location">One</a></SectionListItem>
//
// Keyboard:
//   - None -- not interactive; any interactive children handle their own keys
//
// Accessibility:
//   - Native <li> semantics; the link inside the item carries its own name
//   - Put aria-current on the link inside the item to mark the current section
//
// Internationalization:
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - Port gap: the Svelte catalog renders a `current` prop that sets data-current; this React component does not (the Svelte one is canonical)
//
// References:
//   - MDN <li>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface SectionListItemProps {
    class?: string;
    children: JSX.Element;
    [key: string]: unknown;
}

export default function SectionListItem(props: SectionListItemProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "children");
    return (
        <li
            class={`section-list-item ${p.class}`}
            {...restProps}
        >
            {p.children}
        </li>
    );
}
