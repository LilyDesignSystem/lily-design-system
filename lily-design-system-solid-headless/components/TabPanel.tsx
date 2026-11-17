// TabPanel component
//
// A content panel associated with a tab in a tab bar. Inspired by Adobe
// Spectrum.
//
// Props:
//   class     — string, optional. CSS class name.
//   label         — string, REQUIRED. aria-label for the panel.
//   labelledBy    — string, optional. ID of the tab button that controls
//                  this panel. When provided, sets aria-labelledby and
//                  omits aria-label.
//   selected      — boolean, default false. Whether the panel is the
//                  currently selected one.
//   children      — ReactNode, optional. Panel content.
//   ...restProps  — additional HTML attributes spread onto the root <div>.
//
// Behavior:
//   - role="tabpanel"
//   - tabIndex={0} so the panel is focusable for keyboard users
//   - hidden when not selected
//
// Headless rules:
//   - No CSS, no inline styles
//   - All user-facing strings are consumer-supplied (i18n)
//
// References:
//   - WAI-ARIA Tabs Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface TabPanelProps {
    class?: string;
    /** aria-label for the panel (used when labelledBy is not provided) */
    label: string;
    /** ID of the tab button that controls this panel */
    labelledBy?: string;
    /** Whether the panel is the currently selected one */
    selected?: boolean;
    /** Panel content */
    children?: JSX.Element;
    [key: string]: unknown;
}

export default function TabPanel(props: TabPanelProps) {
    const p = merge({ class: "" as const, selected: false }, props);
    const restProps = omit(p, "class", "label", "labelledBy", "selected", "children");
    return (
        <div
            class={`tab-panel ${p.class}`}
            role="tabpanel"
            aria-label={p.labelledBy !== undefined ? undefined : p.label}
            aria-labelledby={p.labelledBy}
            hidden={!p.selected}
            tabindex={0}
            {...restProps}
        >
            {p.children}
        </div>
    );
}
