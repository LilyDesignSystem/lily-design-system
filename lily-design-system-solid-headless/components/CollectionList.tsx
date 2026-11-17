// CollectionList component
//
// A compact list of multiple related items such as articles, events, or
// resources. Renders an unordered list (<ul>) so the children are exposed
// with native list semantics. Each child should be a CollectionListItem.
// The optional label provides an accessible name for the list when needed.
//
// Props:
//   class — string, optional. CSS class name appended to the root.
//   label     — string, optional. aria-label for the list.
//   children  — ReactNode, required. CollectionListItem children.
//   ...restProps — additional HTML attributes spread onto the <ul>.
//
// Syntax:
//   <CollectionList label="Recent articles">
//     <CollectionListItem heading="Article one" />
//     <CollectionListItem heading="Article two" />
//   </CollectionList>
//
// Accessibility:
//   - The native <ul> provides list semantics
//   - aria-label provides an optional accessible name
//
// Internationalization:
//   - All user-facing text is consumer-supplied via the label prop
//
// Claude rules:
//   - Headless: no CSS, no styles
//   - label is optional
//
// References:
//   - USWDS Collection: https://designsystem.digital.gov/components/collection/

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface CollectionListProps {
    class?: string;
    /** Optional aria-label for the list */
    label?: string;
    /** CollectionListItem children */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function CollectionList(props: CollectionListProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "children");
    return (
        <ul
            class={`collection-list ${p.class}`}
            aria-label={p.label}
            {...restProps}
        >
            {p.children}
        </ul>
    );
}
