// BreadcrumbListItem component
//
// A single step in a breadcrumb navigation trail. Renders as a semantic <li>
// element designed to be placed inside a BreadcrumbList component. Supports
// data-current to indicate the user's current location. Typically
// contains a link for ancestor pages, or plain text for the current page.
//
// Props:
//   class — string, optional. CSS class name.
//   current — boolean, default false. Whether this item represents the current page.
//   children — ReactNode, required. Breadcrumb content, typically an <a> link or plain text.
//   ...restProps — additional HTML attributes spread onto the <li>.
//
// Syntax:
//   <BreadcrumbListItem><a href="/">Home</a></BreadcrumbListItem>
//
// Examples:
//
//   <BreadcrumbListItem><a href="/products">Products</a></BreadcrumbListItem>
//
//
//   <BreadcrumbListItem current>About</BreadcrumbListItem>
//
// Keyboard:
//   None directly — keyboard interaction is handled by the contained links.
//
// Accessibility:
//   - Implicit listitem role from the semantic <li> element
//   - data-current set when current is true, indicating the user's location
//
// Internationalization:
//   - All text comes through children prop; no hardcoded strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Compound component: must be used inside a BreadcrumbList
//
// References:
//   - WAI-ARIA Breadcrumb Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
import { attr } from "./attr";
export interface BreadcrumbListItemProps {
    class?: string;
    /** Whether this is the current page. */
    current?: boolean;
    /** Breadcrumb content. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function BreadcrumbListItem(props: BreadcrumbListItemProps) {
    const p = merge({ class: "" as const, current: false }, props);
    const restProps = omit(p, "class", "current", "children");
    return (
        <li
            class={`breadcrumb-list-item ${p.class}`}
            data-current={attr(p.current ? "" : undefined)}
            {...restProps}
        >
            {p.children}
        </li>
    );
}
