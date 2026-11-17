// ProgressCircle component
//
// A headless circular progress indicator that renders a <div> with ARIA
// progressbar semantics including aria-valuenow, aria-valuemin, and
// aria-valuemax. Unlike a linear progress bar, the progress circle is intended
// for radial layout, commonly used for loading indicators, completion
// percentages, and dashboard widgets. Consumers provide their own CSS to create
// the circular visual representation using the ARIA value attributes.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, required. Accessible name for the progress indicator via aria-label.
//   value — number, default 0. Current progress value.
//   min — number, default 0. Minimum value of the progress range.
//   max — number, default 100. Maximum value of the progress range.
//   children — ReactNode, optional. Content rendered inside (e.g., percentage text).
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <ProgressCircle label="Upload" value={75} />
//
// Examples:
//
//   <ProgressCircle label="Upload" value={75}>
//     <span>75%</span>
//   </ProgressCircle>
//
//
//   <ProgressCircle label="Loading" value={30} />
//
// Keyboard:
//   None — this is a passive, read-only display element.
//
// Accessibility:
//   - role="progressbar" identifies the element as a progress indicator
//   - aria-label provides the accessible name
//   - aria-valuenow communicates the current progress value
//   - aria-valuemin and aria-valuemax define the progress range
//
// Internationalization:
//   - The label prop is the only user-facing text; no hardcoded strings
//   - Inner content (e.g., percentage) comes through children prop
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling including circular appearance
//   - Consumer uses aria-valuenow/min/max or data attributes for CSS-driven circular rendering
//   - Do not add SVG or canvas — consumer provides the visual representation
//
// References:
//   - WAI-ARIA Meter Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/meter/
//   - MDN role="progressbar": https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/progressbar_role

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
import { attr } from "./attr";
export interface ProgressCircleProps {
    class?: string;
    /** Accessible label. */
    label: string;
    /** Current value. */
    value?: number;
    /** Minimum value. */
    min?: number;
    /** Maximum value. */
    max?: number;
    /** Optional content rendered inside. */
    children?: JSX.Element;
    [key: string]: unknown;
}

export default function ProgressCircle(props: ProgressCircleProps) {
    const p = merge({ class: "" as const, value: 0, min: 0, max: 100 }, props);
    const restProps = omit(p, "class", "label", "value", "min", "max", "children");
    return (
        <div
            class={`progress-circle ${p.class}`}
            role="progressbar"
            aria-label={p.label}
            aria-valuenow={attr(p.value)}
            aria-valuemin={attr(p.min)}
            aria-valuemax={attr(p.max)}
            {...restProps}
        >
            {p.children && <>{p.children}</>}
        </div>
    );
}
