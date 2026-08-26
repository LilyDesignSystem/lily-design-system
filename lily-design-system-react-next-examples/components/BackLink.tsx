// BackLink component
//
// A headless navigation link for returning to a previous page or step.
// Renders as a semantic <a> element with optional aria-label override.
// Inspired by the GOV.UK back link pattern. Commonly placed at the top of
// a page to let users return to the previous step in a multi-step flow,
// or navigate up to a parent page.
//
// Props:
//   className — string, optional. CSS class name.
//   href     — string, required. The URL to navigate back to.
//   label    — string, optional. Accessible label override via aria-label,
//              for when visible link text is insufficient for screen readers.
//   children — ReactNode, required. The link content (text or mixed content).
//   ...restProps — additional HTML attributes spread onto <a>.
//
// Syntax:
//   <BackLink href="/previous">Back</BackLink>
//
// Examples:
//   
//   <BackLink href="/previous-page">Back to previous page</BackLink>
//
//   
//   <BackLink href="/dashboard" label="Return to dashboard">Back</BackLink>
//
//   
//   <BackLink href="/step-2" data-step="3">Go back</BackLink>
//
// Keyboard:
//   - Tab: Focus the link (native browser behavior)
//   - Enter: Activate the link (native browser behavior)
//
// Accessibility:
//   - Implicit link role from the <a> element
//   - aria-label provides screen reader override when visible text is brief
//   - Place at the top of the page, before the main heading
//
// Internationalization:
//   - Link text comes through children prop
//   - Label override comes through label prop
//   - No hardcoded strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Consumer adds back arrow icon or visual indicator
//   - Always require href; do not use <a> without href
//
// References:
//   - GOV.UK back link pattern: https://design-system.service.gov.uk/components/back-link/

import React from "react";

export interface BackLinkProps {
    className?: string;
    /** The URL to navigate back to */
    href: string;
    /** Accessible label override for screen readers */
    label?: string;
    /** The link content */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function BackLink({
    className = "",
    href,
    label = undefined,
    children,
    ...restProps
}: BackLinkProps) {
    return (
        <a
        className={`back-link ${className}`}
        href={href}
        aria-label={label}
        {...restProps}
        >
        {children}
        </a>
    );
}
