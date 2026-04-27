// Statistic component
//
// A numeric value display with title, optional prefix (e.g. currency symbol),
// and optional suffix (e.g. unit or %). The value is supplied pre-formatted
// — the consumer is responsible for number formatting / locale.
//
// Props:
//   className    — string, optional. CSS class name.
//   title        — string, REQUIRED. Statistic label/heading.
//   value        — string, REQUIRED. Pre-formatted value text.
//   prefix       — ReactNode, optional. Element before the value.
//   suffix       — ReactNode, optional. Element after the value.
//   label        — string, optional. aria-label override (defaults to "{title}: {value}").
//   ...restProps — additional HTML attributes spread onto the root <div>.
//
// Syntax:
//   <Statistic title="Revenue" value="123,456" prefix="$" suffix="USD" />
//
// Accessibility:
//   - role="group" on the container
//   - aria-label is consumer-provided or auto-composed as "{title}: {value}"
//
// Internationalization:
//   - All user-facing strings are consumer-supplied; numbers are pre-formatted by the consumer.
//
// Claude rules:
//   - Headless: no CSS, no styles
//   - Required string props are non-optional in the interface
//   - prefix and suffix are ReactNode props (named slots in other frameworks)
//
// References:
//   - Ant Design Statistic: https://ant.design/components/statistic

import React from "react";

export interface StatisticProps {
    className?: string;
    /** Statistic label/heading (required) */
    title: string;
    /** Pre-formatted value text (required) */
    value: string;
    /** Element before the value (e.g. currency symbol) */
    prefix?: React.ReactNode;
    /** Element after the value (e.g. unit or %) */
    suffix?: React.ReactNode;
    /** aria-label override (defaults to "{title}: {value}") */
    label?: string;
    [key: string]: unknown;
}

export default function Statistic({
    className = "",
    title,
    value,
    prefix = undefined,
    suffix = undefined,
    label = undefined,
    ...restProps
}: StatisticProps) {
    const ariaLabel: string = label ?? `${title}: ${value}`;
    return (
        <div
            className={`statistic ${className}`}
            role="group"
            aria-label={ariaLabel}
            {...restProps}
        >
            <div className="statistic-title">{title}</div>
            <div className="statistic-value">
                {prefix !== undefined && prefix !== null ? (
                    <span className="statistic-prefix">{prefix}</span>
                ) : null}
                {value}
                {suffix !== undefined && suffix !== null ? (
                    <span className="statistic-suffix">{suffix}</span>
                ) : null}
            </div>
        </div>
    );
}
