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
import { merge, omit } from "solid-js";
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
    [key: string]: unknown;
}

export default function Statistic(props: StatisticProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "title", "value", "prefix", "suffix", "label");
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
        </div>
    );
}
