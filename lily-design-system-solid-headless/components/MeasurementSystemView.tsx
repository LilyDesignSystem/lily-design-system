// MeasurementSystemView component
//
// A headless display component that shows a measurement system name in a
// <span> element. A measurement system is a collection of units and rules for
// measuring physical quantities, such as "metric", "imperial", or "SI". This
// is a read-only display component, part of the Input/View pattern for
// measurement data.
//
// Props:
//   class — string, optional. CSS class name.
//   value — string, required. The measurement system name to display.
//   label — string, optional. Accessible name via aria-label for additional context.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <MeasurementSystemView value="metric" />
//
// Examples:
//
//   <MeasurementSystemView value="metric" />
//
//
//   <MeasurementSystemView value="SI" label="International System of Units" />
//
// Keyboard:
//   - None — this is a display-only component with no interactive behavior.
//
// Accessibility:
//   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
//   - Text content is inherently accessible to screen readers
//
// Internationalization:
//   - All text comes through the value and label props
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Part of the Input/View pattern; pairs with MeasurementSystemInput
//
// References:
//   - HTML span element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span

import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export interface MeasurementSystemViewProps {
    class?: string;
    /** The measurement system name to display */
    value: string;
    /** Optional accessible name */
    label?: string;
    [key: string]: unknown;
}

export default function MeasurementSystemView(props: MeasurementSystemViewProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(p, "class", "value", "label");
    return (
        <span
            class={`measurement-system-view ${p.class}`}
            {...restProps}
        >
            {p.label ? <span class="screen-reader-span">{`${p.label} `}</span> : null}
            {p.value}
        </span>
    );
}
