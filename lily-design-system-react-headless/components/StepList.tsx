// StepList component
//
// An ordered list of step items showing progress through a multi-step
// process. Renders an `<ol>` with optional `aria-label` and `data-current`
// hooks. Children are typically `StepListItem` components.
//
// Props:
//   className    — string, optional. CSS class name.
//   label        — string, optional. aria-label for the list.
//   current      — number, optional. Index of the current step (0-based) for `data-current`.
//   children     — ReactNode, required. step-list-item children.
//   ...restProps — additional HTML attributes spread onto the <ol>.
//
// Syntax:
//   <StepList label="Sign up" current={1}>
//     <StepListItem status="finished">Account</StepListItem>
//     <StepListItem status="in-progress" current>Profile</StepListItem>
//     <StepListItem status="waiting">Confirm</StepListItem>
//   </StepList>
//
// Accessibility:
//   - <ol> provides list semantics
//   - aria-label is optional
//
// Internationalization:
//   - label is consumer-supplied
//
// Claude rules:
//   - Headless: no CSS, no styles
//
// References:
//   - Ant Design Steps: https://ant.design/components/steps

import React from "react";

export interface StepListProps {
    className?: string;
    /** aria-label for the list */
    label?: string;
    /** Index of the current step (0-based) */
    current?: number;
    /** step-list-item children */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function StepList({
    className = "",
    label = undefined,
    current = undefined,
    children,
    ...restProps
}: StepListProps) {
    return (
        <ol
            className={`step-list ${className}`}
            aria-label={label}
            data-current={typeof current === "number" ? current : undefined}
            {...restProps}
        >
            {children}
        </ol>
    );
}
