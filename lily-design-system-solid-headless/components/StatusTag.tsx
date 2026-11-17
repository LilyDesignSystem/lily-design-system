// StatusTag component
//
// A short status label. Renders a <span> with the `status-tag` hook; the status vocabulary and colours
// are the consumer's.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, optional. Hidden text read before the content: a <span> cannot take a name.
//   children — JSX.Element, required. The content.
//   ...restProps — additional HTML attributes spread onto the root <span>.
//
// Syntax:
//   <StatusTag type="success">…</StatusTag>
//
// Examples:
//   <StatusTag type="warning">Pending</StatusTag>
//
// Keyboard:
//   - None -- not interactive; any interactive children handle their own keys
//
// Accessibility:
//   - No role is rendered; pass role="status" through restProps only when the tag's text changes after load
//   - Meaning must come from the text, not the colour (WCAG 1.4.1)
//
// Internationalization:
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//
// References:
//   - WAI-ARIA status role: https://www.w3.org/TR/wai-aria-1.2/#status

import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
import { attr } from "./attr";
export interface StatusTagProps {
    class?: string;
    label?: string;
    /** The status, rendered as data-type for the theme: as in Svelte, and as on alert, badge and banner. */
    type?: "default" | "info" | "success" | "warning" | "error";
    children: JSX.Element;
    [key: string]: unknown;
}

export default function StatusTag(props: StatusTagProps) {
    const p = withDefaults({ class: "" as const, type: "default" as const }, props);
    const restProps = omit(p, "class", "label", "type", "children");
    return (
        <span
            class={`status-tag ${p.class}`}
            data-type={attr(p.type)}
            {...restProps}
        >
            {p.label ? <span class="screen-reader-span">{`${p.label} `}</span> : null}
            {p.children}
        </span>
    );
}
