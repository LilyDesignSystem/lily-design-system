// BrasilCartaoNacionalDeSaudeInput component
//
// A headless input for entering Brazil's Cartão Nacional de Saúde (CNS).
// Format: Fifteen-digit number issued by Brazil's Sistema Único de Saúde (SUS), grouped as NNN NNNN NNNN NNNN. Numbers starting 1 or 2 are definitive (linked to the national civil registry); numbers starting 7, 8, or 9 are provisional. Both forms are validated with a weighted-sum Modulus-11 check across all 15 digits.
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
//   <BrasilCartaoNacionalDeSaudeInput label="Cartão Nacional de Saúde (CNS)" value={value} onChange={setValue} />
//
// Accessibility:
//   - aria-label provides the accessible name for screen readers
//   - autoComplete="off" protects sensitive identifiers
//   - required and disabled states are conveyed to assistive technology
//
// References:
//   - https://en.wikipedia.org/wiki/CPF_number

import React from "react";

export interface BrasilCartaoNacionalDeSaudeInputProps {
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

export default function BrasilCartaoNacionalDeSaudeInput({
    className = "",
    label,
    value = "",
    required = false,
    disabled = false,
    onChange,
    ...restProps
}: BrasilCartaoNacionalDeSaudeInputProps) {
    return (
        <input
        className={`brasil-cartao-nacional-de-saude-input ${className}`}
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
