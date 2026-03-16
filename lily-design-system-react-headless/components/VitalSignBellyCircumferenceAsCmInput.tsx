// VitalSignBellyCircumferenceAsCmInput component
//
// A headless numeric input for entering a belly circumference value in
// centimeters (cm). Wraps a native <input type="number"> element with accessible
// labelling and physiologically appropriate min, max, and step constraints.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name for the input via aria-label.
//   value — number | undefined, default undefined. Current belly circumference value; controlled.
//   min — number, default 0. Minimum allowed value.
//   max — number, default 300. Maximum allowed value.
//   step — number, default 1. Increment/decrement step size.
//   required — boolean, default false.
//   disabled — boolean, default false.
//   onChange — callback, optional. Called with the new numeric value on change.
//   ...restProps — additional HTML attributes spread onto the <input>.
//
// Syntax:
//   <VitalSignBellyCircumferenceAsCmInput label="Belly circumference (cm)" value={value} onChange={setValue} />
//
// Keyboard:
//   - Up Arrow: increment value by step
//   - Down Arrow: decrement value by step
//
// Claude rules:
//   - Headless: no CSS, no styles
//   - Do not wrap in a <div> — renders a bare <input> element

import React from "react";

export interface VitalSignBellyCircumferenceAsCmInputProps {
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

export default function VitalSignBellyCircumferenceAsCmInput({
    className = "",
    label,
    value = undefined,
    min = 0,
    max = 300,
    step = 1,
    required = false,
    disabled = false,
    onChange,
    ...restProps
}: VitalSignBellyCircumferenceAsCmInputProps) {
    return (
        <input
            className={`vital-sign-belly-circumference-as-cm-input ${className}`}
            type="number"
            aria-label={label}
            value={value}
            onChange={(e) => onChange?.(Number(e.target.value))}
            min={min}
            max={max}
            step={step}
            required={required}
            disabled={disabled}
            {...restProps}
        />
    );
}
