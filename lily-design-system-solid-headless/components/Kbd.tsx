// Kbd component
//
// An inline element for keyboard shortcuts and key combinations.
//
// Props:
//   class — string, optional. CSS class name.
//   label    — string, optional. Spoken form, read instead of the visible key.
//   children — ReactNode, required. Component content.
//   ...restProps — additional HTML attributes spread onto the <kbd>.
//
// Accessibility:
//   - native <kbd> semantics
//   - hidden text comes from `label` when given
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//
// References:
//   - HTML kbd element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/kbd

import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
import { attr } from "./attr";
export interface KbdProps {
    class?: string;
    /** Spoken form, read instead of the visible key. */
    label?: string;
    /** Component content. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function Kbd(props: KbdProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "children");
    return (
        <kbd
            class={`kbd ${p.class}`}
            {...restProps}
        >
            {p.label ? <span class="screen-reader-span">{`${p.label} `}</span> : null}
            <span
                class="kbd-text"
                aria-hidden={attr(p.label ? "true" : undefined)}
            >
                {p.children}
            </span>
        </kbd>
    );
}
