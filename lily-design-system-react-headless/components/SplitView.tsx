// SplitView component
//
// A two-panel resizable layout container with a draggable divider between
// them. Inspired by Adobe Spectrum.
//
// Props:
//   className     — string, optional. CSS class name.
//   label         — string, REQUIRED. aria-label for the container.
//   orientation   — "horizontal" | "vertical", default "horizontal".
//   primary       — ReactNode, REQUIRED. First panel content.
//   secondary     — ReactNode, REQUIRED. Second panel content.
//   divider       — ReactNode, optional. Custom divider content.
//   splitPercent  — number 0-100, default 50. Initial split position as percentage.
//   ...restProps  — additional HTML attributes spread onto the root <div>.
//
// Behavior:
//   - Renders sections for primary and secondary content
//   - When `divider` is not provided, renders a default <div role="separator"
//     aria-orientation aria-valuenow aria-valuemin aria-valuemax tabIndex={0}>
//
// Headless rules:
//   - No CSS, no inline styles
//   - All user-facing strings are consumer-supplied (i18n)
//
// References:
//   - Adobe Spectrum SplitView: https://spectrum.adobe.com/page/split-view/

import React from "react";

export interface SplitViewProps {
    className?: string;
    /** aria-label for the container (required) */
    label: string;
    /** Orientation of the divider */
    orientation?: "horizontal" | "vertical";
    /** First panel content (required) */
    primary: React.ReactNode;
    /** Second panel content (required) */
    secondary: React.ReactNode;
    /** Custom divider content */
    divider?: React.ReactNode;
    /** Initial split position as percentage (0-100) */
    splitPercent?: number;
    [key: string]: unknown;
}

export default function SplitView({
    className = "",
    label,
    orientation = "horizontal",
    primary,
    secondary,
    divider = undefined,
    splitPercent = 50,
    ...restProps
}: SplitViewProps) {
    return (
        <div
        className={`split-view ${className}`}
        aria-label={label}
        data-orientation={orientation}
        data-split-percent={splitPercent}
        {...restProps}
        >
            <section className="split-view-primary">{primary}</section>
            {divider !== undefined ? (
                divider
            ) : (
                <div
                className="split-view-divider"
                role="separator"
                aria-orientation={orientation}
                aria-valuenow={splitPercent}
                aria-valuemin={0}
                aria-valuemax={100}
                tabIndex={0}
                />
            )}
            <section className="split-view-secondary">{secondary}</section>
        </div>
    );
}
