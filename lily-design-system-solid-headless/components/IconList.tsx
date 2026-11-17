// IconList component
//
// An ordered list (rendered as <ul>) of icon list item components. Each child
// should typically be an IconListItem with a leading icon slot and text.
// Inspired by the USWDS Icon list component.
//
// Props:
//   class — string, optional. CSS class name appended to the root.
//   label     — string, optional. aria-label for the list.
//   children  — ReactNode, required. IconListItem children.
//   ...restProps — additional HTML attributes spread onto the <ul>.
//
// Syntax:
//   <IconList label="Benefits">
//     <IconListItem icon={<Check />}>Easy to use</IconListItem>
//   </IconList>
//
// Accessibility:
//   - The native <ul> provides list semantics
//   - aria-label provides an optional accessible name
//
// Internationalization:
//   - All user-facing text is consumer-supplied via props
//
// Claude rules:
//   - Headless: no CSS, no styles
//   - label is optional
//
// References:
//   - USWDS Icon list: https://designsystem.digital.gov/components/icon-list/

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface IconListProps {
    class?: string;
    /** Optional aria-label for the list */
    label?: string;
    /** IconListItem children */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function IconList(props: IconListProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "children");
    return (
        <ul
            class={`icon-list ${p.class}`}
            aria-label={p.label}
            {...restProps}
        >
            {p.children}
        </ul>
    );
}
