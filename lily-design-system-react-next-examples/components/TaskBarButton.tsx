// TaskBarButton component
//
// A single button item within a TaskBar. Renders as a native <button> element
// with type="button" for proper keyboard and screen reader support. The
// component avoids unintended form submissions and supports the disabled
// attribute for disabling interaction. Content is provided through the
// children prop.
//
// Props:
//   className — string, optional. CSS class name.
//   disabled — boolean, default false. Whether the button is disabled.
//   children — ReactNode, required. Button content.
//   ...restProps — additional HTML attributes spread onto the <button>.
//
// Syntax:
//   <TaskBarButton>New Task</TaskBarButton>
//
// Examples:
//   
//   <TaskBarButton disabled>Delete</TaskBarButton>
//
// Keyboard:
//   - Tab: focus the button
//   - Enter/Space: activate the button (native behavior)
//   - Button is skipped in tab order when disabled
//
// Accessibility:
//   - Implicit button role from the <button> element
//   - disabled attribute communicates disabled state to assistive technology
//
// Internationalization:
//   - All text is provided through the children prop
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - Designed to be placed inside a TaskBar container
//   - type="button" prevents accidental form submission
//
// References:
//   - WAI-ARIA Toolbar Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/

import React from "react";

export interface TaskBarButtonProps {
    className?: string;
    /** Whether disabled. */
    disabled?: boolean;
    /** Button content. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function TaskBarButton({
    className = "",
    disabled = false,
    children,
    ...restProps
}: TaskBarButtonProps) {
    return (
        <button
        className={`task-bar-button ${className}`}
        type="button"
        disabled={disabled}
        {...restProps}
        >
        {children}
        </button>
    );
}
