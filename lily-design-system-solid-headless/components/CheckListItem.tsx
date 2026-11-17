// CheckListItem component
//
// A single item within a CheckList. Renders as an <li> containing a
// checkbox <input> and a <label> for the item text. Supports checked
// and disabled states. Designed for use inside a CheckList <ol>.
//
// Props:
//   class — string, optional. CSS class name.
//   checked — boolean, default false. Whether the checkbox is checked.
//   disabled — boolean, default false. Whether the checkbox is disabled.
//   children — ReactNode, required. The label content for this item.
//   ...restProps — additional HTML attributes spread onto the <li>.
//
// Syntax:
//   <CheckListItem>Task one</CheckListItem>
//
// Examples:
//
//   <CheckListItem checked>Create account</CheckListItem>
//
//
//   <CheckListItem disabled>Locked step</CheckListItem>
//
// Keyboard:
//   - Space: toggles the checkbox when focused
//   - Tab: moves focus to the next focusable element
//
// Accessibility:
//   - Native <input type="checkbox"> provides built-in accessibility
//   - <label> wraps the checkbox and text for a larger click target
//   - disabled attribute prevents interaction when set
//
// Internationalization:
//   - Item text comes through children prop; no hardcoded strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Must be used inside a CheckList component (which provides the <ol>)
//
// References:
//   - MDN checkbox: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface CheckListItemProps {
    class?: string;
    /** Whether the checkbox is checked. */
    checked?: boolean;
    /** Whether the checkbox is disabled. */
    disabled?: boolean;
    /** Item label content. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function CheckListItem(props: CheckListItemProps) {
    const p = merge({ class: "" as const, checked: false, disabled: false }, props);
    const restProps = omit(p, "class", "checked", "disabled", "children");
    return (
        <li
            class={`check-list-item ${p.class}`}
            {...restProps}
        >
            <label>
                <input
                    type="checkbox"
                    checked={p.checked}
                    disabled={p.disabled}
                    readonly
                />
                {p.children}
            </label>
        </li>
    );
}
