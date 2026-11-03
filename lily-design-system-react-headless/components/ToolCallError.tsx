// ToolCallError component
//
// The error shown when a tool call fails. Renders a <div role="alert"> with the `tool-call-error`
// hook, so the error is announced when it appears.
//
// Props:
//   className — string, optional. CSS class name.
//   children — React.ReactNode, optional. The error text.
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

import React from "react";

export interface ToolCallErrorProps {
    className?: string;

    /** The content. */
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function ToolCallError({
    className = "",

    children,
    ...restProps
}: ToolCallErrorProps) {
    return (
        <div
            className={`tool-call-error ${className}`}
            role="alert"
            {...restProps}
        >
            {children}
        </div>
    );
}
