// ToolCallError component
//
// The error shown when a tool call fails. Renders a <div role="alert"> with the `tool-call-error`
// hook, so the error is announced when it appears.
//
// Props:
//   class — string, optional. CSS class name.
//   children — JSX.Element, optional. The error text.
//   ...restProps — additional HTML attributes spread onto the root <div>.
//
// Syntax:
//   <ToolCallError>…</ToolCallError>
//
// Examples:
//   <ToolCall status="error" open><ToolCallError>The tool timed out.</ToolCallError></ToolCall>
//
// Keyboard:
//   - None -- not interactive; any interactive children handle their own keys
//
// Accessibility:
//   - role="alert" announces the error assertively when it is inserted
//   - Open the ToolCall on error so the alert is not inside a closed <details>, where it would not be announced
//
// Internationalization:
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - A part of ToolCall; carries no strings of its own
//
// References:
//   - WAI-ARIA alert role: https://www.w3.org/TR/wai-aria-1.2/#alert

import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export interface ToolCallErrorProps {
    class?: string;

    /** The content. */
    children?: JSX.Element;
    [key: string]: unknown;
}

export default function ToolCallError(props: ToolCallErrorProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(p, "class", "children");
    return (
        <div
            class={`tool-call-error ${p.class}`}
            role="alert"
            {...restProps}
        >
            {p.children}
        </div>
    );
}
