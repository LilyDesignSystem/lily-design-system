// ContentsLink component
//
// One table of contents link. Renders as a semantic <a> element with
// optional aria-label override for descriptive screen reader text.
//
// Props:
//   className — string, optional. CSS class name.
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

import React from "react";

export interface ContentsLinkProps {
    className?: string;
    /** The URL to navigate to. */
    href: string;
    /** Accessible label override for screen readers. */
    label?: string;
    /** Tasks (or items) to show a count for; sets data-count on the link (and data-complete when 0). */
    count?: number;
    /** Visible, localised count text (e.g. "3 to do"), rendered inside the link after the text. */
    countLabel?: string;
    /** The link content. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function ContentsLink({
    className = "",
    href,
    label = undefined,
    count = undefined,
    countLabel = undefined,
    children,
    ...restProps
}: ContentsLinkProps) {
    return (
        <a
            className={`contents-link ${className}`}
            href={href}
            aria-label={label}
            data-count={count}
            data-complete={count === 0 ? "" : undefined}
            {...restProps}
        >
            {children}
            {countLabel ? <span className="contents-link-count">{countLabel}</span> : null}
        </a>
    );
}
