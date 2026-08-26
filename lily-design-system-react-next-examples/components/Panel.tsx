// Panel component
//
// A headless labeled container for grouping related content, controls, or settings.
// It renders a semantic <section> element with an accessible label, creating a
// named region landmark that assistive technology can identify and navigate to.
// Commonly used in dashboards, settings pages, sidebars, and multi-section layouts.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name for the panel region via aria-label.
//   children — ReactNode, required. The panel content.
//   ...restProps — additional HTML attributes spread onto the <section>.
//
// Syntax:
//   <Panel label="Settings">{children}</Panel>
//
// Examples:
//   
//   <Panel label="Settings">
//     <p>Adjust your preferences below.</p>
//   </Panel>
//
//   
//   <Panel label="Account information">
//     <p>Name, email, and profile details.</p>
//   </Panel>
//   <Panel label="Notification preferences">
//     <p>Choose how you want to be notified.</p>
//   </Panel>
//
// Keyboard:
//   None — this is a passive container. Screen reader users can navigate to
//   named regions using landmark navigation shortcuts.
//
// Accessibility:
//   - <section aria-label="..."> creates a named region landmark
//   - Assistive technology can list and navigate to this section via landmarks
//   - The aria-label value should be concise and descriptive of the panel content
//
// Internationalization:
//   - The label prop is the only text; consumer provides all content through children
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Uses <section> not <div> for proper landmark semantics
//   - Do not add headings — consumer provides heading elements as needed
//
// References:
//   - WAI-ARIA region role: https://www.w3.org/TR/wai-aria-1.2/#region
//   - HTML section element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/section
//   - WAI Landmarks: https://www.w3.org/WAI/ARIA/apd/practices/landmark-regions/

import React from "react";

export interface PanelProps {
    className?: string;
    label: string;
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function Panel({
    className = "",
    label,
    children,
    ...restProps
}: PanelProps) {
    return (
        <section
        className={`panel ${className}`}
        aria-label={label}
        {...restProps}
        >
        {children}
        </section>
    );
}
