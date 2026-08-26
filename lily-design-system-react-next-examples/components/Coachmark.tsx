// Coachmark component
//
// An anchored popover that spotlights and explains a single feature.
// Inspired by Adobe Spectrum.
//
// Props:
//   className     — string, optional. CSS class name.
//   open          — boolean, default false. Whether the coachmark is visible.
//   title         — string, REQUIRED. Heading text.
//   description   — string, optional. Body text.
//   dismissLabel  — string, REQUIRED. Accessible label for the dismiss button.
//   onDismiss     — dismiss click handler.
//   ...restProps  — additional HTML attributes spread onto the root <div>.
//
// Behavior:
//   - Renders <div role="dialog" aria-modal="false">
//   - Generates stable ids with React.useId() for aria-labelledby and aria-describedby
//   - aria-describedby is only set when `description` is provided
//
// Headless rules:
//   - No CSS, no inline styles
//   - All user-facing strings are consumer-supplied (i18n)
//
// References:
//   - Adobe Spectrum Coachmark: https://spectrum.adobe.com/page/coach-mark/
//   - WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/

import React, { useId } from "react";

export interface CoachmarkProps {
    className?: string;
    /** Whether the coachmark is visible */
    open?: boolean;
    /** Heading text (required) */
    title: string;
    /** Body text */
    description?: string;
    /** Accessible label for the dismiss button (required) */
    dismissLabel: string;
    /** Dismiss click handler */
    onDismiss?: (event: React.MouseEvent) => void;
    [key: string]: unknown;
}

export default function Coachmark({
    className = "",
    open = false,
    title,
    description = undefined,
    dismissLabel,
    onDismiss = undefined,
    ...restProps
}: CoachmarkProps) {
    const reactId = useId();
    const titleId = `coachmark-${reactId}-title`;
    const descId = `coachmark-${reactId}-desc`;
    return (
        <div
        className={`coachmark ${className}`}
        role="dialog"
        aria-modal="false"
        aria-labelledby={titleId}
        aria-describedby={description !== undefined ? descId : undefined}
        hidden={!open}
        {...restProps}
        >
            <h2 className="coachmark-title" id={titleId}>{title}</h2>
            {description !== undefined && (
                <p className="coachmark-description" id={descId}>{description}</p>
            )}
            <button
            className="coachmark-dismiss"
            type="button"
            aria-label={dismissLabel}
            onClick={onDismiss}
            >
                ×
            </button>
        </div>
    );
}
