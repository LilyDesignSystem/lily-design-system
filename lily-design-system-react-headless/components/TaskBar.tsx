// TaskBar component
//
// A headless task bar container using the ARIA toolbar role. It renders a <div>
// with role="toolbar" and manages horizontal focus movement between action
// buttons via ArrowLeft/ArrowRight keys. Commonly used for quick access to
// frequently performed actions such as "New", "Open", "Save", or task-specific
// operations.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name for the toolbar via aria-label.
//   children — ReactNode, required. TaskBarButton elements.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <TaskBar label="Tasks">
//     <TaskBarButton>New</TaskBarButton>
//   </TaskBar>
//
// Examples:
//
//   <TaskBar label="Tasks">
//     <TaskBarButton>New</TaskBarButton>
//     <TaskBarButton>Open</TaskBarButton>
//     <TaskBarButton>Save</TaskBarButton>
//   </TaskBar>
//
// Keyboard:
//   - ArrowRight: move focus to next item, wrapping from last to first
//   - ArrowLeft: move focus to previous item, wrapping from first to last
//   - Home: move focus to the first item
//   - End: move focus to the last item
//
// Accessibility:
//   - role="toolbar" identifies the container as a toolbar widget
//   - aria-label provides the accessible name for the toolbar
//
// Internationalization:
//   - The label prop accepts any translated string
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - Compound component: use with TaskBarButton
//   - Uses horizontal (ArrowLeft/ArrowRight) navigation
//   - Arrow keys wrap around at boundaries
//
// References:
//   - WAI-ARIA Toolbar Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/

import React, { useEffect, useRef } from "react";
import { attachToolbar } from "./widget-keys";
import { warnMissingName } from "./dev-warning";

export interface TaskBarProps {
    className?: string;
    /** Accessible label. */
    label: string;
    /** TaskBarButton elements. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function TaskBar({ className = "", label, children, ...restProps }: TaskBarProps) {
    warnMissingName("TaskBar", label, restProps["aria-label"], restProps["aria-labelledby"]);
    const barRef = useRef<HTMLDivElement>(null);

    useEffect(() => attachToolbar(barRef.current!), []);

    return (
        <div
            className={`task-bar ${className}`}
            role="toolbar"
            aria-label={label}
            ref={barRef}
            {...restProps}
        >
            {children}
        </div>
    );
}
