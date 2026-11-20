// Statistic component
//
// A numeric value display with title, optional prefix (e.g. currency symbol),
// and optional suffix (e.g. unit or %). The value is supplied pre-formatted
// — the consumer is responsible for number formatting / locale.
//
// Props:
//   class    — string, optional. CSS class name.
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

import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export interface StatisticProps {
    class?: string;
    /** Statistic label/heading (required) */
    title: string;
    /** Pre-formatted value text (required) */
    value: string;
    /** Element before the value (e.g. currency symbol) */
    prefix?: JSX.Element;
    /** Element after the value (e.g. unit or %) */
    suffix?: JSX.Element;
    /** aria-label override (defaults to "{title}: {value}") */
    label?: string;
    /** The change, in words that name what it is compared with ("0.5 more than October 2024") */
    change?: string;
    /** The direction of the change, as data-trend for the theme; the words in `change` carry it for everyone */
    trend?: "up" | "down" | "flat";
    /** When the value was measured, as an ISO 8601 date or date-time for the <time> element */
    asOf?: string;
    /** When the value was measured, in words; the as-of line renders only with it */
    asOfLabel?: string;
    [key: string]: unknown;
}

export default function Statistic(props: StatisticProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(
        p,
        "class",
        "title",
        "value",
        "prefix",
        "suffix",
        "label",
        "change",
        "trend",
        "asOf",
        "asOfLabel",
    );
    const ariaLabel = (): string => p.label ?? `${p.title}: ${p.value}`;
    return (
        <div
            class={`statistic ${p.class}`}
            role="group"
            aria-label={ariaLabel()}
            {...restProps}
        >
            <div class="statistic-title">{p.title}</div>
            <div class="statistic-value">
                {p.prefix !== undefined && p.prefix !== null ? (
                    <span class="statistic-prefix">{p.prefix}</span>
                ) : null}
                {p.value}
                {p.suffix !== undefined && p.suffix !== null ? (
                    <span class="statistic-suffix">{p.suffix}</span>
                ) : null}
            </div>
            {p.change ? (
                <div
                    class="statistic-change"
                    data-trend={p.trend}
                >
                    {p.change}
                </div>
            ) : null}
            {p.asOfLabel ? (
                <time
                    class="statistic-as-of"
                    datetime={p.asOf}
                >
                    {p.asOfLabel}
                </time>
            ) : null}
        </div>
    );
}
