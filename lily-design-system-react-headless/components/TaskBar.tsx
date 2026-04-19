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

import React, { useRef } from "react";

export interface TaskBarProps {
    className?: string;
    /** Accessible label. */
    label: string;
    /** TaskBarButton elements. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function TaskBar({
    className = "",
    label,
    children,
    ...restProps
}: TaskBarProps) {
    const barRef = useRef<HTMLDivElement>(null);

    function handleKeyDown(event: React.KeyboardEvent) {
        if (!barRef.current) return;
        const items = Array.from(
            barRef.current.querySelectorAll<HTMLElement>(
                "button, [role='button'], [tabindex]",
            ),
        );
        const current = document.activeElement as HTMLElement;
        const index = items.indexOf(current);
        switch (event.key) {
            case "ArrowRight": {
                event.preventDefault();
                const next = index < items.length - 1 ? index + 1 : 0;
                items[next]?.focus();
                break;
            }
            case "ArrowLeft": {
                event.preventDefault();
                const prev = index > 0 ? index - 1 : items.length - 1;
                items[prev]?.focus();
                break;
            }
            case "Home": {
                event.preventDefault();
                items[0]?.focus();
                break;
            }
            case "End": {
                event.preventDefault();
                items[items.length - 1]?.focus();
                break;
            }
        }
    }

    return (
        <div
        className={`task-bar ${className}`}
        role="toolbar"
        aria-label={label}
        ref={barRef}
        onKeyDown={handleKeyDown}
        {...restProps}
        >
        {children}
        </div>
    );
}
