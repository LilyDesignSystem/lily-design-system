// BreadcrumbLink component
//
// One breadcrumb link in the trail. Renders as a semantic <a> element with
// optional aria-label override for descriptive screen reader text.
//
// Props:
//   class — string, optional. CSS class name.
//   href     — string, required. The URL to navigate to.
//   label    — string, optional. Accessible label override via aria-label.
//   children — ReactNode, required. The link content.
//   ...restProps — additional HTML attributes spread onto <a>.
//
// Keyboard:
//   - Tab: Focus the link (native browser behavior)
//   - Enter: Activate the link (native browser behavior)
//
// Accessibility:
//   - Implicit link role from the <a> element
//   - aria-label provides a screen-reader override when the visible text is brief
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Always require href; do not render <a> without href
//
// References:
//   - HTML a element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface BreadcrumbLinkProps {
    class?: string;
    /** The URL to navigate to. */
    href: string;
    /** Accessible label override for screen readers. */
    label?: string;
    /** The link content. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function BreadcrumbLink(props: BreadcrumbLinkProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "href", "label", "children");
    return (
        <a
            class={`breadcrumb-link ${p.class}`}
            href={p.href}
            aria-label={p.label}
            {...restProps}
        >
            {p.children}
        </a>
    );
}
