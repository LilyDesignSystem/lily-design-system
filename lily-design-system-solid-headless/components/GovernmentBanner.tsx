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
//   class    — string, optional. CSS class name appended to the root.
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

import type { JSX } from "@solidjs/web";
import { omit, createUniqueId } from "solid-js";
import { withDefaults } from "./defaults";
import { attr } from "./attr";
export interface GovernmentBannerProps {
    class?: string;
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
    children?: JSX.Element;
    [key: string]: unknown;
}

export default function GovernmentBanner(props: GovernmentBannerProps) {
    const p = withDefaults({ class: "" as const, expanded: false }, props);
    const restProps = omit(
        p,
        "class",
        "label",
        "headerText",
        "expanded",
        "expandLabel",
        "onToggle",
        "children",
    );
    const panelId = createUniqueId();

    return (
        <aside
            class={`government-banner ${p.class}`}
            aria-label={p.label}
            {...restProps}
        >
            <header class="government-banner-header">
                <span class="government-banner-text">{p.headerText}</span>
                <button
                    type="button"
                    class="government-banner-toggle"
                    aria-expanded={attr(p.expanded)}
                    aria-controls={panelId}
                    onClick={p.onToggle}
                >
                    {p.expandLabel}
                </button>
            </header>
            <div
                class="government-banner-details"
                id={panelId}
                hidden={!p.expanded}
            >
                {p.children}
            </div>
        </aside>
    );
}
