// Sparkline component
//
// A headless sparkline chart container that provides a semantic wrapper with
// role="img" for compact, minimalist data visualizations. Sparklines display
// trends or variations as tiny line, bar, or win/loss charts, typically embedded
// within text or tables. The consumer provides SVG, canvas, or other rendering.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name describing the sparkline data via aria-label.
//   children — ReactNode, required. The visualization content (SVG, canvas, etc.).
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <Sparkline label="Sales trend">
//     <svg></svg>
//   </Sparkline>
//
// Examples:
//
//   <Sparkline label="Revenue trend over past 7 days">
//     <svg viewBox="0 0 100 20"><polyline points="0,20 20,10 40,15 60,5 80,12 100,2" /></svg>
//   </Sparkline>
//
//
//   <Sparkline label="Temperature last 24 hours">
//     <canvas width="100" height="20"></canvas>
//   </Sparkline>
//
// Keyboard:
//   - None — this is a passive container for data visualization.
//
// Accessibility:
//   - role="img" identifies the container as a graphical image
//   - aria-label describes what the sparkline represents
//   - Screen readers announce the label in place of the visual content
//
// Internationalization:
//   - The label prop externalizes the data description for localization
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - No internal state or chart rendering — purely a structural wrapper
//   - Consumer provides all visualization content via children prop
//
// References:
//   - WAI-ARIA img role: https://www.w3.org/TR/wai-aria-1.2/#img

import React from "react";

import { warnMissingProp } from "./dev-warning";

export interface SparklineProps {
    className?: string;
    /** Accessible label */
    label?: string;
    /** How many readings the consumer's graphic shows. */
    pointCount?: number;
    /** Fewer readings than this are not a trend: only insufficientLabel is shown, as text. Rendered as data-insufficient. */
    minimumPoints?: number;
    /** Why there is no line, in the consumer's words; required with minimumPoints. */
    insufficientLabel?: string;
    /** The component content */
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function Sparkline({
    className = "",
    label,
    pointCount,
    minimumPoints,
    insufficientLabel,
    children,
    ...restProps
}: SparklineProps) {
    if (minimumPoints !== undefined)
        warnMissingProp(
            "Sparkline",
            "insufficientLabel",
            insufficientLabel,
            "a sparkline that draws no line must say why in words.",
        );
    const insufficient =
        pointCount !== undefined && minimumPoints !== undefined && pointCount < minimumPoints;
    return (
        <span
            className={`sparkline ${className}`}
            role={insufficient ? undefined : "img"}
            aria-label={insufficient ? undefined : label}
            data-insufficient={insufficient ? "" : undefined}
            {...restProps}
        >
            {insufficient ? (
                <span className="sparkline-insufficient">{insufficientLabel}</span>
            ) : (
                children
            )}
        </span>
    );
}
