// ValidationListItem component
//
// One validation rule in a ValidationList with a status of "pending",
// "passed", or "failed". The status is exposed via a data-status attribute
// for consumer styling and for assistive technology to detect via custom
// patterns. Inspired by the USWDS Validation component.
//
// Props:
//   className — string, optional. CSS class name appended to the root.
//   status    — "pending" | "passed" | "failed", default "pending". Rule status.
//   label     — string, optional. aria-label override.
//   children  — ReactNode, required. Rule text.
//   ...restProps — additional HTML attributes spread onto the <li>.
//
// Syntax:
//   <ValidationListItem status="passed">At least 8 characters</ValidationListItem>
//
// Accessibility:
//   - The native <li> provides list-item semantics
//   - data-status conveys state for consumer styling
//   - aria-label optionally overrides the accessible name
//
// Internationalization:
//   - All user-facing text is consumer-supplied via children
//
// Claude rules:
//   - Headless: no CSS, no styles
//   - status defaults to "pending"
//
// References:
//   - USWDS Validation: https://designsystem.digital.gov/components/validation/

import React from "react";

export type ValidationListItemStatus = "pending" | "passed" | "failed";

export interface ValidationListItemProps {
    className?: string;
    /** Rule status; rendered as data-status */
    status?: ValidationListItemStatus;
    /** Optional aria-label override */
    label?: string;
    /** Rule text */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function ValidationListItem({
    className = "",
    status = "pending",
    label,
    children,
    ...restProps
}: ValidationListItemProps) {
    return (
        <li
        className={`validation-list-item ${className}`}
        data-status={status}
        aria-label={label}
        {...restProps}
        >
        {children}
        </li>
    );
}
