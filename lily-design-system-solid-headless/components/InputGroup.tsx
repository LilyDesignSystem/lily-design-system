// InputGroup component
//
// A headless wrapper that places optional prefix and suffix addons around an
// input. Renders <div role="group"> so the group is announced as a single
// unit by assistive technologies. The consumer places the actual input as
// children; the addons are rendered through the prefix and suffix props.
//
// Props:
//   class — string, optional. CSS class name.
//   label     — string, optional. aria-label for the group.
//   prefix    — ReactNode, optional. Addon before the input.
//   suffix    — ReactNode, optional. Addon after the input.
//   children  — ReactNode, required. The input element(s).
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <InputGroup label="Amount" prefix={<span>$</span>} suffix={<span>USD</span>}>
//     <input type="number" />
//   </InputGroup>
//
// Examples:
//
//   <InputGroup label="Amount" prefix={<span>$</span>}>
//     <input type="number" />
//   </InputGroup>
//
//
//   <InputGroup
//     label="Search"
//     prefix={<SearchIcon />}
//     suffix={<button>Clear</button>}
//   >
//     <input type="search" />
//   </InputGroup>
//
// Keyboard: None at the group level; children provide their own.
//
// Accessibility:
//   - role="group" wraps the input + addons as a single semantic group
//   - aria-label on the group describes what the bundle represents
//   - Addons rendered as <span> with hook classes for consumer CSS
//
// Internationalization:
//   - label and addon content all consumer-supplied
//
// Claude rules:
//   - Headless: no CSS, no styles
//   - Addon spans use hook classes input-group-prefix and input-group-suffix
//
// References:
//   - WAI-ARIA role="group": https://www.w3.org/TR/wai-aria-1.2/#group

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface InputGroupProps {
    class?: string;
    /** aria-label for the group */
    label?: string;
    /** Addon rendered before the input */
    prefix?: JSX.Element;
    /** Addon rendered after the input */
    suffix?: JSX.Element;
    /** The input element(s) */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function InputGroup(props: InputGroupProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "prefix", "suffix", "children");
    return (
        <div
            class={`input-group ${p.class}`}
            role="group"
            aria-label={p.label}
            {...restProps}
        >
            {p.prefix !== undefined ? <span class="input-group-prefix">{p.prefix}</span> : null}
            {p.children}
            {p.suffix !== undefined ? <span class="input-group-suffix">{p.suffix}</span> : null}
        </div>
    );
}
