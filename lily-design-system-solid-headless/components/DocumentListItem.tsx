// DocumentListItem component
//
// One document in a DocumentList. Renders an <li> with the `document-list-item` hook around the
// consumer's link, type and size.
//
// Props:
//   class — string, optional. CSS class name.
//   children — JSX.Element, required. The document link and its details.
//   ...restProps — additional HTML attributes spread onto the root <li>.
//
// Syntax:
//   <DocumentListItem>…</DocumentListItem>
//
// Examples:
//   <DocumentList><DocumentListItem><a href="/report.pdf">Report</a></DocumentListItem></DocumentList>
//
// Keyboard:
//   - None -- not interactive; any interactive children handle their own keys
//
// Accessibility:
//   - Native <li> semantics; the link inside the item carries its own name
//
// Internationalization:
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//
// References:
//   - MDN <li>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface DocumentListItemProps {
    class?: string;
    children: JSX.Element;
    [key: string]: unknown;
}

export default function DocumentListItem(props: DocumentListItemProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "children");
    return (
        <li
            class={`document-list-item ${p.class}`}
            {...restProps}
        >
            {p.children}
        </li>
    );
}
