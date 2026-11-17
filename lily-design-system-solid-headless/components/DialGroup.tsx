// DialGroup component
//
// A labelled group container for one or more Dial components. Renders a
// <div role="group"> with the kebab class so screen readers announce the
// dials as a related set.
//
// Props:
//   class — string, optional. CSS class name.
//   label    — string, required. Accessible label for the group.
//   children — ReactNode, required. Dial components.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Accessibility:
//   - role="group" + aria-label labels the dial group
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//
// References:
//   - WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface DialGroupProps {
    class?: string;
    /** Accessible label for the dial group. */
    label: string;
    /** Dial components. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function DialGroup(props: DialGroupProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "children");
    return (
        <div
            class={`dial-group ${p.class}`}
            role="group"
            aria-label={p.label}
            {...restProps}
        >
            {p.children}
        </div>
    );
}
