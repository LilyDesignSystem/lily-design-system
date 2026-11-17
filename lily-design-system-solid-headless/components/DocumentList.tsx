// DocumentList component
//
// A list of documents. Renders a <ul> with the `document-list` hook; items are DocumentListItem.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, optional. Accessible name, rendered as aria-label on the root.
//   children — JSX.Element, required. The DocumentListItem children.
//   ...restProps — additional HTML attributes spread onto the root <ul>.
//
// Syntax:
//   <DocumentList label="…">…</DocumentList>
//
// Examples:
//   <DocumentList label="Reports"><DocumentListItem>…</DocumentListItem></DocumentList>
//
// Keyboard:
//   - None -- not interactive; any interactive children handle their own keys
//
// Accessibility:
//   - aria-label comes from `label` when given
//
// Internationalization:
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//
// References:
//   - MDN <ul>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul

import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export interface DocumentListProps {
    class?: string;
    label?: string;
    children: JSX.Element;
    [key: string]: unknown;
}

export default function DocumentList(props: DocumentListProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "children");
    return (
        <ul
            class={`document-list ${p.class}`}
            aria-label={p.label}
            {...restProps}
        >
            {p.children}
        </ul>
    );
}
