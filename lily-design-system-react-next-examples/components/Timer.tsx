// Timer component
//
// A headless timer that renders a semantic <time> element with role="timer"
// and aria-live="polite" for accessible countdown or elapsed time displays.
// The consumer manages the actual timer logic (intervals, countdowns) and
// provides formatted display content through the children prop. Commonly
// used for session timeouts, countdowns, stopwatches, cooking timers, and
// exam time limits.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   children — ReactNode, required. Formatted timer display content.
//   ...restProps — additional HTML attributes spread onto the <time> (e.g. datetime="PT5M30S").
//
// Syntax:
//   <Timer label="Countdown">05:30</Timer>
//
// Examples:
//   
//   <Timer label="Session timeout" datetime="PT5M30S">5:30</Timer>
//
//   
//   <Timer label="Elapsed time">{formatted}</Timer>
//
// Keyboard:
//   - None -- informational display, not interactive
//
// Accessibility:
//   - role="timer" indicates countdown or elapsed time
//   - aria-label provides the accessible name for screen readers
//   - aria-live="polite" announces timer updates without interrupting
//   - Semantic <time> element supports machine-readable time data
//
// Internationalization:
//   - The label prop externalizes the accessible label string
//   - The children prop allows localized time formatting
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - Consumer manages timer logic; component only provides structure and accessibility
//   - Optional datetime attribute via restProps for ISO 8601 duration format
//
// References:
//   - WAI-ARIA timer role: https://www.w3.org/TR/wai-aria-1.2/#timer
//   - HTML <time> element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time
//   - ISO 8601 Duration format: https://en.wikipedia.org/wiki/ISO_8601#Durations

import React from "react";

export interface TimerProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** Timer display content (formatted time string) */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function Timer({
    className = "",
    label,
    children,
    ...restProps
}: TimerProps) {
    return (
        <time
        className={`timer ${className}`}
        role="timer"
        aria-label={label}
        aria-live="polite"
        {...restProps}
        >
        {children}
        </time>
    );
}
