// TaiwanGuominShenfenzhengTongyiBianhaoView component
//
// A headless display component for showing Taiwan's
// National Identification Card Number in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <TaiwanGuominShenfenzhengTongyiBianhaoView label="National Identification Card Number" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://en.wikipedia.org/wiki/National_identification_card_(Taiwan)

import React from "react";

export interface TaiwanGuominShenfenzhengTongyiBianhaoViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function TaiwanGuominShenfenzhengTongyiBianhaoView({
    className = "",
    label,
    value = "",
    ...restProps
}: TaiwanGuominShenfenzhengTongyiBianhaoViewProps) {
    return (
        <span
            className={`taiwan-guomin-shenfenzheng-tongyi-bianhao-view ${className}`}
            aria-label={label}
            {...restProps}
        >
            {value}
        </span>
    );
}
