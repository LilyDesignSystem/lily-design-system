// StatusLight component
//
// A small colored dot status indicator paired with a status label.
// Inspired by Adobe Spectrum.
//
// Props:
//   className     — string, optional. CSS class name.
//   variant       — "neutral" | "informative" | "positive" | "notice"
//                  | "negative" | "active" | "inactive", default "neutral".
//                  Exposed via data-variant.
//   label         — string, REQUIRED. The status text (e.g., "Active", "Offline").
//   ...restProps  — additional HTML attributes spread onto the root <span>.
//
// Behavior:
//   Renders <span role="status" data-variant={variant}> containing
//   <span class="status-light-dot" aria-hidden="true"></span> and
//   <span class="status-light-label">{label}</span>.
//
// Headless rules:
//   - No CSS, no inline styles
//   - All user-facing strings are consumer-supplied (i18n)
//
// References:
//   - Adobe Spectrum StatusLight: https://spectrum.adobe.com/page/status-light/

import React from "react";

export type StatusLightVariant =
    | "neutral"
    | "informative"
    | "positive"
    | "notice"
    | "negative"
    | "active"
    | "inactive";

export interface StatusLightProps {
    className?: string;
    /** Status variant; rendered as data-variant */
    variant?: StatusLightVariant;
    /** The status text (required) */
    label: string;
    [key: string]: unknown;
}

export default function StatusLight({
    className = "",
    variant = "neutral",
    label,
    ...restProps
}: StatusLightProps) {
    return (
        <span
        className={`status-light ${className}`}
        role="status"
        data-variant={variant}
        {...restProps}
        >
            <span className="status-light-dot" aria-hidden="true"></span>
            <span className="status-light-label">{label}</span>
        </span>
    );
}
