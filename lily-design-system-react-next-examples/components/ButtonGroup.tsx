// ButtonGroup component
//
// A wrapper that groups related buttons together as a single accessible group.
// Renders a generic container with role="group" and an aria-label so assistive
// technology announces the group as a unit. The component is purely structural
// and applies no visual styling — consumers provide all CSS.
//
// Props:
//   className — string, optional. CSS class name appended to the root.
//   label     — string, REQUIRED. aria-label for the group.
//   children  — ReactNode, required. The related buttons.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <ButtonGroup label="Document actions">
//     <button>Save</button>
//     <button>Cancel</button>
//   </ButtonGroup>
//
// Examples:
//
//   <ButtonGroup label="Pagination">
//     <button>Previous</button>
//     <button>Next</button>
//   </ButtonGroup>
//
// Accessibility:
//   - role="group" identifies the container as a group of related controls
//   - aria-label provides the accessible name for the group
//
// Internationalization:
//   - The label prop is consumer-supplied for localized accessible names
//
// Claude rules:
//   - Headless: no CSS, no styles
//   - label is non-optional in the interface
//
// References:
//   - WAI-ARIA Group Role: https://www.w3.org/TR/wai-aria-1.2/#group
//   - USWDS Button group: https://designsystem.digital.gov/components/button-group/

import React from "react";

export interface ButtonGroupProps {
    className?: string;
    /** aria-label for the group (required for accessibility) */
    label: string;
    /** The related buttons */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function ButtonGroup({
    className = "",
    label,
    children,
    ...restProps
}: ButtonGroupProps) {
    return (
        <div
        className={`button-group ${className}`}
        role="group"
        aria-label={label}
        {...restProps}
        >
        {children}
        </div>
    );
}
