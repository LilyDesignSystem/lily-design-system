// StepListItem component
//
// One step in a step list. Status is exposed as `data-status`. When
// `current=true`, `aria-current="step"` is set so assistive tech announces
// the active step.
//
// Props:
//   className    — string, optional. CSS class name.
//   status       — "waiting" | "in-progress" | "finished" | "error", default "waiting".
//   current      — boolean, default false. When true, sets aria-current="step".
//   label        — string, optional. aria-label override.
//   children     — ReactNode, optional. Step content (typically title + description).
//   ...restProps — additional HTML attributes spread onto the <li>.
//
// Syntax:
//   <StepListItem status="in-progress" current>
//     <strong>Profile</strong>
//     <span>Add your photo</span>
//   </StepListItem>
//
// Accessibility:
//   - aria-current="step" when current=true
//   - aria-label optional
//
// Internationalization:
//   - All user-facing strings are consumer-supplied via children/label
//
// Claude rules:
//   - Headless: no CSS, no styles
//
// References:
//   - Ant Design Steps: https://ant.design/components/steps
//   - aria-current: https://www.w3.org/TR/wai-aria-1.2/#aria-current

import React from "react";

export type StepListItemStatus = "waiting" | "in-progress" | "finished" | "error";

export interface StepListItemProps {
    className?: string;
    /** Step status */
    status?: StepListItemStatus;
    /** Whether this is the current step */
    current?: boolean;
    /** aria-label override */
    label?: string;
    /** Step content */
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function StepListItem({
    className = "",
    status = "waiting",
    current = false,
    label = undefined,
    children = undefined,
    ...restProps
}: StepListItemProps) {
    return (
        <li
            className={`step-list-item ${className}`}
            data-status={status}
            aria-current={current ? "step" : undefined}
            aria-label={label}
            {...restProps}
        >
            {children}
        </li>
    );
}
