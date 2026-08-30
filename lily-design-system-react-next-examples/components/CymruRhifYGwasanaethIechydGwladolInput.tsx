// CymruRhifYGwasanaethIechydGwladolInput component
//
// A headless input for entering Wales's Rhif y Gwasanaeth Iechyd Gwladol (Rhif GIG).
// Format: 10 digits in 3-3-4 format with a Modulus-11 check digit (shared with England and the Isle of Man).
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". Bindable input value; supports value + onChange.
//   required — boolean, default false. Whether the input is required for form submission.
//   disabled — boolean, default false. Whether the input is disabled.
//   ...restProps — additional HTML attributes spread onto the <input>.
//
// Syntax:
//   <CymruRhifYGwasanaethIechydGwladolInput label="National Health Service Number" value={value} onChange={setValue} />
//
// Accessibility:
//   - aria-label provides the accessible name for screen readers
//   - autoComplete="off" protects sensitive identifiers
//   - required and disabled states are conveyed to assistive technology
//
// References:
//   - https://en.wikipedia.org/wiki/NHS_number

import React from "react";

export interface CymruRhifYGwasanaethIechydGwladolInputProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The current value of the input, bindable */
    value?: string;
    /** Whether the input is required for form submission */
    required?: boolean;
    /** Whether the input is disabled */
    disabled?: boolean;
    /** Callback when value changes. */
    onChange?: (value: string) => void;
    [key: string]: unknown;
}

export default function CymruRhifYGwasanaethIechydGwladolInput({
    className = "",
    label,
    value = "",
    required = false,
    disabled = false,
    onChange,
    ...restProps
}: CymruRhifYGwasanaethIechydGwladolInputProps) {
    return (
        <input
        className={`cymru-rhif-y-gwasanaeth-iechyd-gwladol-input ${className}`}
        type="text"
        aria-label={label}
        autoComplete="off"
        value={value} onChange={(e) => onChange?.(e.target.value)}
        required={required}
        disabled={disabled}
        {...restProps}
        />
    );
}
