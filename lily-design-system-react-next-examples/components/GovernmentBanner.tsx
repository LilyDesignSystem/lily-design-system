// GovernmentBanner component
//
// A banner that identifies a website as belonging to a government, with an
// expandable details panel explaining how to recognize an official site.
// Inspired by the USWDS Banner component. Renders an <aside> containing a
// header with the headline text and a toggle <button>, plus a details panel
// that is shown or hidden based on the `expanded` prop. The panel id is
// generated with React's useId() so the toggle's aria-controls reference
// is stable across renders.
//
// Props:
//   className    — string, optional. CSS class name appended to the root.
//   label        — string, REQUIRED. aria-label for the banner section.
//   headerText   — string, REQUIRED. Top headline (e.g., "An official website...").
//   expanded     — boolean, default false. Whether the details panel is open.
//   expandLabel  — string, REQUIRED. Toggle button text (e.g., "Here's how you know").
//   onToggle     — () => void, optional. Called when the toggle button is clicked.
//   children     — ReactNode, optional. Details panel content.
//   ...restProps — additional HTML attributes spread onto the <aside>.
//
// Syntax:
//   <GovernmentBanner
//     label="Official government website"
//     headerText="An official website of the United States government"
//     expandLabel="Here's how you know"
//     expanded={open}
//     onToggle={() => setOpen(!open)}
//   >
//     …details content…
//   </GovernmentBanner>
//
// Accessibility:
//   - <aside> identifies a complementary landmark
//   - aria-label on the section provides an accessible name
//   - aria-expanded on the toggle reflects the panel state
//   - aria-controls links the toggle to the panel id
//   - The details panel uses the native `hidden` attribute when collapsed
//
// Internationalization:
//   - All user-facing strings (label, headerText, expandLabel, children) are consumer-supplied
//
// Claude rules:
//   - Headless: no CSS, no styles
//   - label, headerText, expandLabel are non-optional in the interface
//   - useId() generates a stable id for aria-controls
//
// References:
//   - USWDS Banner: https://designsystem.digital.gov/components/banner/
//   - WAI-ARIA Disclosure Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/

import React, { useId } from "react";

export interface GovernmentBannerProps {
    className?: string;
    /** aria-label for the banner section (required) */
    label: string;
    /** Top headline text (required) */
    headerText: string;
    /** Whether the details panel is open */
    expanded?: boolean;
    /** Toggle button text (required) */
    expandLabel: string;
    /** Toggle handler */
    onToggle?: () => void;
    /** Details panel content */
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function GovernmentBanner({
    className = "",
    label,
    headerText,
    expanded = false,
    expandLabel,
    onToggle,
    children,
    ...restProps
}: GovernmentBannerProps) {
    const panelId = useId();

    return (
        <aside
        className={`government-banner ${className}`}
        aria-label={label}
        {...restProps}
        >
        <header className="government-banner-header">
            <span className="government-banner-text">{headerText}</span>
            <button
            type="button"
            className="government-banner-toggle"
            aria-expanded={expanded}
            aria-controls={panelId}
            onClick={onToggle}
            >
            {expandLabel}
            </button>
        </header>
        <div
        className="government-banner-details"
        id={panelId}
        hidden={!expanded}
        >
        {children}
        </div>
        </aside>
    );
}
