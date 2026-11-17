// SegmentGroup component
//
// A headless segmented control group that uses the ARIA radiogroup role to
// contain a set of mutually exclusive options. Renders a <div> with
// role="radiogroup" and expects children to be SegmentGroupItem buttons
// (or buttons with role="radio" and aria-checked). Used for view mode toggles,
// filter selections, display density controls, and similar single-select UIs.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, required. Accessible name for the segment group via aria-label.
//   children — ReactNode, required. Segment button elements to render inside the group.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <SegmentGroup label="View">
//     <button role="radio" aria-checked="true">Grid</button>
//     <button role="radio" aria-checked="false">List</button>
//   </SegmentGroup>
//
// Examples:
//
//   <SegmentGroup label="Display mode">
//     <SegmentGroupItem checked={mode === 'grid'} value="grid">Grid</SegmentGroupItem>
//     <SegmentGroupItem checked={mode === 'list'} value="list">List</SegmentGroupItem>
//   </SegmentGroup>
//
// Keyboard:
//   - Tab: moves focus into the segment group
//   - Arrow Left/Right: consumer should implement navigation between segments
//   - Space/Enter: consumer should implement activation of the focused segment
//
// Accessibility:
//   - role="radiogroup" identifies the container as mutually exclusive radio-like options
//   - aria-label provides an accessible name for the group
//   - Children should use role="radio" and aria-checked attributes
//
// Internationalization:
//   - The label prop externalizes the accessible label string
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Consumer manages selection state (toggling aria-checked on children)
//   - Compound component: use with SegmentGroupItem
//
// References:
//   - WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radio/

import type { JSX } from "@solidjs/web";
import { omit, onSettled, untrack } from "solid-js";
import { withDefaults } from "./defaults";
import { attachRadioGroup } from "./widget-keys";
import { warnMissingName } from "./dev-warning";

export interface SegmentGroupProps {
    class?: string;
    /** Accessible label. */
    label: string;
    /** Segment elements. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function SegmentGroup(props: SegmentGroupProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "children");
    warnMissingName("SegmentGroup", p.label, p["aria-label"], p["aria-labelledby"]);
    const rootRef: { current: HTMLDivElement | null } = { current: null };
    onSettled(() => untrack(() => attachRadioGroup(rootRef.current!)));

    return (
        <div
            ref={(el) => (rootRef.current = el)}
            class={`segment-group ${p.class}`}
            role="radiogroup"
            aria-label={p.label}
            {...restProps}
        >
            {p.children}
        </div>
    );
}
