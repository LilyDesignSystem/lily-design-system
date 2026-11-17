// Meter component
//
// A headless meter that displays a scalar measurement within a known range
// using the native HTML <meter> element. It supports optional threshold
// indicators for low, high, and optimum values. Useful for displaying disk
// usage, battery level, password strength, performance scores, or any bounded
// numeric measurement.
//
// Props:
//   class — string, optional. CSS class name.
//   value — number, required. The current measured value.
//   min — number, default 0. The minimum bound of the range.
//   max — number, default 100. The maximum bound of the range.
//   low — number, optional. The upper bound of the low range threshold.
//   high — number, optional. The lower bound of the high range threshold.
//   optimum — number, optional. The optimal value within the range.
//   label — string, required. Accessible name for the meter via aria-label.
//   ...restProps — additional HTML attributes spread onto the <meter>.
//
// Syntax:
//   <Meter label="Disk space" value={45} max={100} />
//
// Examples:
//
//   <Meter label="Disk space" value={45} max={100} />
//
//
//   <Meter label="Battery" value={20} min={0} max={100} low={25} high={75} optimum={100} />
//
// Keyboard:
//   - None — this is a passive display element with no interactive behavior.
//
// Accessibility:
//   - aria-label={label} provides an accessible name describing what the meter measures
//   - Native <meter> element provides built-in semantics for assistive technologies
//   - Text content inside the element serves as a fallback for unsupported browsers
//
// Internationalization:
//   - The label prop accepts any translated string
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Uses native <meter> element for built-in semantic support
//
// References:
//   - HTML meter element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meter
//   - WAI-ARIA meter role: https://www.w3.org/TR/wai-aria-1.2/#meter

import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export interface MeterProps {
    class?: string;
    value: number;
    min?: number;
    max?: number;
    low?: number;
    high?: number;
    optimum?: number;
    label: string;
    [key: string]: unknown;
}

export default function Meter(props: MeterProps) {
    const p = withDefaults({ class: "" as const, min: 0, max: 100 }, props);
    const restProps = omit(p, "class", "value", "min", "max", "low", "high", "optimum", "label");
    return (
        <meter
            class={`meter ${p.class}`}
            value={p.value}
            min={p.min}
            max={p.max}
            low={p.low}
            high={p.high}
            optimum={p.optimum}
            aria-label={p.label}
            {...restProps}
        >
            {p.value}
        </meter>
    );
}
