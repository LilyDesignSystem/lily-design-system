// NumberInput component
//
// A headless numeric input that wraps a native <input type="number"> element
// with accessible labelling and optional min, max, and step constraints. It
// provides a bindable numeric value for two-way data flow. Commonly used for
// quantity selectors, age inputs, price fields, and configuration values.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name for the input via aria-label.
//   value — number | undefined, default undefined. Current numeric value; bindable.
//   min — number, optional. Minimum allowed value.
//   max — number, optional. Maximum allowed value.
//   step — number, optional. Increment/decrement step size.
//   required — boolean, default false. Whether the input is required.
//   disabled — boolean, default false. Whether the input is disabled.
//   ...restProps — additional HTML attributes spread onto the <input>.
//
// Syntax:
//   <NumberInput label="Quantity" value={value} onChange={setValue} />
//
// Examples:
//
//   <NumberInput label="Quantity" value={value} onChange={setValue} min={0} max={100} step={1} />
//
//
//   <NumberInput label="Age" value={value} onChange={setValue} required />
//
// Keyboard:
//   - Up Arrow: increment value by step (native browser behavior)
//   - Down Arrow: decrement value by step (native browser behavior)
//
// Accessibility:
//   - aria-label provides an accessible name describing the input purpose
//   - Implicit spinbutton role from <input type="number">
//   - Native validation via min, max, and step attributes
//
// Internationalization:
//   - The label prop is the only user-facing text; no hardcoded strings
//   - Consumer can pass placeholder via restProps for localized hint text
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Uses controlled for value, not controlled
//   - Do not wrap in a <div> — renders a bare <input> element
//
// References:
//   - HTML number input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number
//   - WAI-ARIA spinbutton role: https://www.w3.org/TR/wai-aria-1.2/#spinbutton

import React from "react";

export interface NumberInputProps {
    className?: string;
    label: string;
    value?: number | undefined;
    min?: number;
    max?: number;
    step?: number;
    required?: boolean;
    disabled?: boolean;
    /** Callback when value changes. */
    onChange?: (value: number | undefined) => void;
    [key: string]: unknown;
}

export default function NumberInput({
    className = "",
    label,
    value = undefined,
    min = undefined,
    max = undefined,
    step = undefined,
    required = false,
    disabled = false,
    onChange,
    ...restProps
}: NumberInputProps) {
    return (
        <input
        className={`number-input ${className}`}
        type="number"
        aria-label={label}
        value={value} onChange={(e) => onChange?.(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        required={required}
        disabled={disabled}
        {...restProps}
        />
    );
}
