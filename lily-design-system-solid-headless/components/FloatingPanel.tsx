// FloatingPanel component
//
// A floating panel container that overlays page content, typically used for tooltips,
// popovers, dropdown menus, or contextual UI. It renders conditionally based on an
// open prop, fully removing itself from the DOM when closed. Consumers are responsible
// for positioning the panel relative to a trigger element using their own CSS.
//
// Props:
//   class — string, optional. CSS class name.
//   open — boolean, default false. Whether the panel is visible.
//   label — string, required. Accessible name for the panel region via aria-label.
//   children — ReactNode, required. Panel content to render inside.
//   ...restProps — additional HTML attributes spread onto the div.
//
// Syntax:
//   <FloatingPanel open={showPanel} label="Options">{children}</FloatingPanel>
//
// Examples:
//
//   <FloatingPanel open={showPanel} label="Options">
//     <p>Panel content</p>
//   </FloatingPanel>
//
//
//   <FloatingPanel open={filtersVisible} label="Filters">
//     <form>...</form>
//   </FloatingPanel>
//
// Keyboard:
//   - None — this is a passive container; consumers should implement focus management and Escape-to-close as needed
//
// Accessibility:
//   - role="region" identifies the panel as a landmark region
//   - aria-label provides an accessible name for the region
//
// Internationalization:
//   - The label prop allows localized accessible names; no hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling and positioning
//   - Uses {open && ...} for conditional rendering (fully removed from DOM when closed)
//   - Consumer manages show/hide logic externally
//
// References:
//   - WAI-ARIA Disclosure Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
import { usePopoverState } from "./Popover";

export interface FloatingPanelProps {
    class?: string;
    /** Whether the panel is visible. */
    open?: boolean;
    /** Accessible name. */
    label: string;
    /** Panel content. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function FloatingPanel(props: FloatingPanelProps) {
    const p = merge({ class: "" as const, open: false }, props);
    const restProps = omit(p, "class", "open", "label", "children");
    const panelRef: { current: HTMLDivElement | null } = { current: null };
    usePopoverState(panelRef, () => p.open);
    return (
        <div
            class={`floating-panel ${p.class}`}
            ref={(el) => (panelRef.current = el)}
            role="region"
            popover="manual"
            aria-label={p.label}
            {...restProps}
        >
            {p.children}
        </div>
    );
}
