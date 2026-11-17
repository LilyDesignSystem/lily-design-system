// Diff component
//
// A side-by-side comparison container for two items. Renders a labelled
// <div role="group"> that wraps the two things being compared (text, code,
// images, before/after pairs). The consumer composes the two panels as
// children and brings any layout (split-pane, stacked) and difference
// highlighting in their CSS.
//
// Props:
//   class — string, optional. CSS class name.
//   label    — string, required. Accessible name describing the comparison.
//   children — ReactNode, required. The two items being compared.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Accessibility:
//   - role="group" + aria-label exposes the wrapper as a labelled group
//     so assistive tech announces it as a comparison region
//   - Each side may add its own aria-label (e.g. "Original", "Modified")
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//
// References:
//   - WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group

import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export interface DiffProps {
    class?: string;
    /** Accessible name describing the comparison. */
    label: string;
    /** The two items being compared. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function Diff(props: DiffProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "children");
    return (
        <div
            class={`diff ${p.class}`}
            role="group"
            aria-label={p.label}
            {...restProps}
        >
            {p.children}
        </div>
    );
}
