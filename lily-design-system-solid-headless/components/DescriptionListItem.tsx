// DescriptionListItem component
//
// One term-and-description group inside a DescriptionList. A <div> is the only element HTML allows to
// wrap dt/dd pairs in a <dl>.
//
// Props:
//   class — string, optional. CSS class name.
//   children — JSX.Element, required. The <dt> and <dd> elements.
//   ...restProps — additional HTML attributes spread onto the root <div>.
//
// Syntax:
//   <DescriptionListItem>…</DescriptionListItem>
//
// Examples:
//   <DescriptionListItem><dt>Name</dt><dd>Sam</dd></DescriptionListItem>
//
// Keyboard:
//   - None -- not interactive; any interactive children handle their own keys
//
// Accessibility:
//
// Internationalization:
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//
// References:
//   - MDN <dl>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface DescriptionListItemProps {
    class?: string;
    children: JSX.Element;
    [key: string]: unknown;
}

export default function DescriptionListItem(props: DescriptionListItemProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "children");
    return (
        <div
            class={`description-list-item ${p.class}`}
            {...restProps}
        >
            {p.children}
        </div>
    );
}
