// AvatarGroup component
//
// A group of avatar components.
//
// Props:
//   class — string, optional. CSS class name.
//   label    — string, optional. Accessible label via aria-label.
//   children — ReactNode, required. Component content.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Accessibility:
//   - native <div> semantics
//   - aria-label exposes a screen-reader name when label is provided
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//
// References:
//   - HTML div element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface AvatarGroupProps {
    class?: string;
    /** Optional accessible label set on aria-label. */
    label?: string;
    /** the consumer's words for the avatars not shown ("and 12 more"), rendered last as -overflow */
    overflowLabel?: string;
    /** Component content. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function AvatarGroup(props: AvatarGroupProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "overflowLabel", "children");
    return (
        <div
            class={`avatar-group ${p.class}`}
            role="group"
            aria-label={p.label}
            {...restProps}
        >
            {p.children}
            {p.overflowLabel ? <span class="avatar-group-overflow">{p.overflowLabel}</span> : null}
        </div>
    );
}
