// Panel component
//
// A headless labeled container for grouping related content, controls, or settings.
// It renders a <div role="group"> named by its label, so assistive technology
// announces the group without adding a landmark for every panel on the page.
// Commonly used in dashboards, settings pages, sidebars, and multi-section layouts.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name for the group via aria-label.
//   children — ReactNode, required. The panel content.
//   ...restProps — additional HTML attributes spread onto the root <div>.
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
//   None — this is a passive container.
//
// Accessibility:
//   - <div role="group" aria-label="..."> names the panel as a group
//   - Not a landmark: pass role="region" for a panel that is a major part of the page
//   - The aria-label value should be concise and descriptive of the panel content
//
// Internationalization:
//   - The label prop is the only text; consumer provides all content through children
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - A <div role="group">, not a <section>: a page of panels would flood the landmark list
//   - Do not add headings — consumer provides heading elements as needed
//
// References:
//   - WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group

import React from "react";

export interface PanelProps {
    className?: string;
    label: string;
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function Panel({ className = "", label, children, ...restProps }: PanelProps) {
    return (
        <div
            className={`panel ${className}`}
            role="group"
            aria-label={label}
            {...restProps}
        >
            {children}
        </div>
    );
}
