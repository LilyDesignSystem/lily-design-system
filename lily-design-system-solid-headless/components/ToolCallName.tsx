// ToolCallName component
//
// The name of the tool in a ToolCall, shown in its summary. Renders a <span> with the `tool-call-name`
// hook.
//
// Props:
//   class — string, optional. CSS class name.
//   children — JSX.Element, optional. The tool name.
//   ...restProps — additional HTML attributes spread onto the root <span>.
//
// Syntax:
//   <ToolCallName>…</ToolCallName>
//
// Examples:
//   <ToolCall status="running"><ToolCallName>search_web</ToolCallName></ToolCall>
//
// Keyboard:
//   - None -- not interactive; any interactive children handle their own keys
//
// Accessibility:
//   - No role or ARIA: plain text inside the ToolCall summary
//
// Internationalization:
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - A part of ToolCall; draws nothing and carries no strings of its own
//
// References:
//   - MDN <span>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface ToolCallNameProps {
    class?: string;

    /** The content. */
    children?: JSX.Element;
    [key: string]: unknown;
}

export default function ToolCallName(props: ToolCallNameProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "children");
    return (
        <span
            class={`tool-call-name ${p.class}`}

            {...restProps}
        >
            {p.children}
        </span>
    );
}
