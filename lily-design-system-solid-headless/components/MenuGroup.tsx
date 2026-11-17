// MenuGroup component
//
// A labeled section of menu items within a menu. Inspired by Adobe Spectrum.
//
// Props:
//   class     — string, optional. CSS class name.
//   label         — string, REQUIRED. Section heading text (also used as aria-label).
//   children      — ReactNode, optional. The menu items.
//   ...restProps  — additional HTML attributes spread onto the root <div>.
//
// Behavior:
//   - Renders <div role="group" aria-label={label}>
//   - Renders a visible heading element marked aria-hidden="true" (since the
//     aria-label conveys the section name to assistive technology).
//
// Headless rules:
//   - No CSS, no inline styles
//   - All user-facing strings are consumer-supplied (i18n)
//
// References:
//   - Adobe Spectrum MenuGroup: https://spectrum.adobe.com/page/menu/

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface MenuGroupProps {
    class?: string;
    /** Section heading text (also used as aria-label) (required) */
    label: string;
    /** The menu items */
    children?: JSX.Element;
    [key: string]: unknown;
}

export default function MenuGroup(props: MenuGroupProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "children");
    return (
        <div
            class={`menu-group ${p.class}`}
            role="group"
            aria-label={p.label}
            {...restProps}
        >
            <div
                class="menu-group-heading"
                aria-hidden="true"
            >
                {p.label}
            </div>
            {p.children}
        </div>
    );
}
