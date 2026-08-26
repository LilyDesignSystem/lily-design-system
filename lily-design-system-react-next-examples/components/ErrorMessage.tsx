// ErrorMessage component
//
// Displays an error message using role="alert" for immediate screen reader
// announcement. Renders a <p> element that acts as an assertive live region,
// so the error text is announced as soon as it enters the DOM. Used for form
// validation feedback, system error notifications, and inline error display.
//
// Props:
//   className — string, optional. CSS class name.
//   children — ReactNode, required. Error message text content.
//   ...restProps — additional HTML attributes spread onto the <p> element.
//
// Syntax:
//   <ErrorMessage>Error text here</ErrorMessage>
//
// Examples:
//   
//   <ErrorMessage>Password is required</ErrorMessage>
//
//   
//   {error && (
//     <ErrorMessage>{error}</ErrorMessage>
//   )}
//
// Keyboard:
//   - None — passive container for displaying error text
//
// Accessibility:
//   - role="alert" creates an implicit aria-live="assertive" live region
//   - Error text is announced immediately to screen readers when it appears
//
// Internationalization:
//   - All error text comes through consumer-provided children
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Uses role="alert" for immediate announcement, not aria-live="polite"
//
// References:
//   - WAI-ARIA Alert Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/alert/

import React from "react";

export interface ErrorMessageProps {
    className?: string;
    /** Error message content. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function ErrorMessage({
    className = "",
    children,
    ...restProps
}: ErrorMessageProps) {
    return (
        <p
        className={`error-message ${className}`}
        role="alert"
        {...restProps}
        >
        {children}
        </p>
    );
}
