// MonthInput component
//
// A headless month input that wraps a native <input type="month"> element with
// accessible labelling for selecting a month and year. It provides a bindable
// value in YYYY-MM format and supports required and disabled states. Useful for
// credit card expiration dates, report periods, billing cycles, or any date
// selection at month granularity.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, required. Accessible name for the input via aria-label.
//   value — string, default "". Current month value in YYYY-MM format; bindable via controlled.
//   required — boolean, default false. Whether the input is required.
//   disabled — boolean, default false. Whether the input is disabled.
//   ...restProps — additional HTML attributes spread onto the <input>.
//
// Syntax:
//   <MonthInput label="Start month" value={value} onChange={setValue} />
//
// Examples:
//
//   <MonthInput label="Start month" value={value} onChange={setValue} />
//
//
//   <MonthInput label="Expiration" value={value} onChange={setValue} required min="2024-01" max="2030-12" />
//
// Keyboard:
//   - Native browser month input keyboard behavior (varies by browser).
//
// Accessibility:
//   - aria-label={label} provides an accessible name describing the input purpose
//   - Supports required and disabled HTML states
//
// Internationalization:
//   - The label prop accepts any translated string
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Value format is always YYYY-MM per the HTML spec
//
// References:
//   - HTML month input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/month

import { merge, omit } from "solid-js";
export interface MonthInputProps {
    class?: string;
    label: string;
    value?: string;
    required?: boolean;
    disabled?: boolean;
    /** Callback when value changes. */
    onChange?: (value: string) => void;
    [key: string]: unknown;
}

export default function MonthInput(props: MonthInputProps) {
    const p = merge(
        { class: "" as const, value: "" as const, required: false, disabled: false },
        props,
    );
    const restProps = omit(p, "class", "label", "value", "required", "disabled", "onChange");
    return (
        <input
            class={`month-input ${p.class}`}
            type="month"
            aria-label={p.label}
            value={p.value}
            onInput={(e) => p.onChange?.(e.currentTarget.value)}
            required={p.required}
            disabled={p.disabled}
            {...restProps}
        />
    );
}
