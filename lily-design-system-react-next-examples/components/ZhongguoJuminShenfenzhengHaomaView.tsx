// ZhongguoJuminShenfenzhengHaomaView component
//
// A headless display component for showing China's
// Resident Identity Card Number (居民身份证号码) in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <ZhongguoJuminShenfenzhengHaomaView label="Resident Identity Card Number (居民身份证号码)" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://en.wikipedia.org/wiki/Resident_Identity_Card

import React from "react";

export interface ZhongguoJuminShenfenzhengHaomaViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function ZhongguoJuminShenfenzhengHaomaView({
    className = "",
    label,
    value = "",
    ...restProps
}: ZhongguoJuminShenfenzhengHaomaViewProps) {
    return (
        <span
        className={`zhongguo-jumin-shenfenzheng-haoma-view ${className}`}
        aria-label={label}
        {...restProps}>{value}</span
        >
    );
}
