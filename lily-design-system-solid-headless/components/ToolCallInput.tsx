// ToolCallInput component
//
// The input or arguments passed to a tool in a ToolCall. Renders a <div> with the `tool-call-input`
// hook; with a `label` it becomes a named group, without one it has no role.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, optional. Accessible name; when given, role="group" and aria-label are rendered, otherwise neither.
//   children — JSX.Element, optional. The content.
//   ...restProps — additional HTML attributes spread onto the root <div>.
//
// Syntax:
//   <ToolCallInput label="…">…</ToolCallInput>
//
// Examples:
//   <ToolCall status="done" open><ToolCallInput label="…"><pre>…</pre></ToolCallInput></ToolCall>
//
// Keyboard:
//   - None -- not interactive; any interactive children handle their own keys
//
// Accessibility:
//   - role="group" and aria-label appear only when `label` is given
//   - The content is usually a <pre> or a description list of arguments
//
// Internationalization:
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - A part of ToolCall; draws nothing and carries no strings of its own
//
// References:
//   - MDN <div>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface ToolCallInputProps {
    class?: string;
    /** Accessible name of the group. */
    label?: string;
    /** The content. */
    children?: JSX.Element;
    [key: string]: unknown;
}

export default function ToolCallInput(props: ToolCallInputProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "children");
    return (
        <div
            class={`tool-call-input ${p.class}`}
            role={p.label ? "group" : undefined}
            aria-label={p.label}
            {...restProps}
        >
            {p.children}
        </div>
    );
}
