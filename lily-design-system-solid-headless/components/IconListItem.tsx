// IconListItem component
//
// One item in an IconList with an optional leading icon slot and required
// text content. The icon is supplied via the `icon` ReactNode prop (NOT
// children). The `children` prop is the textual content of the item. The
// icon span is decorative and uses aria-hidden so the accessible content
// is the text.
//
// Props:
//   class — string, optional. CSS class name appended to the root.
//   icon      — ReactNode, optional. Leading icon content.
//   children  — ReactNode, required. Text content of the item.
//   ...restProps — additional HTML attributes spread onto the <li>.
//
// Syntax:
//   <IconListItem icon={<Check />}>Saves time</IconListItem>
//
// Accessibility:
//   - The native <li> provides list-item semantics
//   - The icon span has aria-hidden="true" (decorative)
//   - The accessible content is the text (children)
//
// Internationalization:
//   - All user-facing text is consumer-supplied via children
//
// Claude rules:
//   - Headless: no CSS, no styles
//   - children is required (the text); icon is a separate ReactNode prop
//
// References:
//   - USWDS Icon list: https://designsystem.digital.gov/components/icon-list/

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface IconListItemProps {
    class?: string;
    /** Leading icon content (decorative, aria-hidden) */
    icon?: JSX.Element;
    /** Text content of the item */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function IconListItem(props: IconListItemProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "icon", "children");
    return (
        <li
            class={`icon-list-item ${p.class}`}
            {...restProps}
        >
            {p.icon && (
                <span
                    class="icon-list-item-icon"
                    aria-hidden="true"
                >
                    {p.icon}
                </span>
            )}
            <span class="icon-list-item-text">{p.children}</span>
        </li>
    );
}
