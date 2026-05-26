// EspanaCodigoDeIdentificacionFiscalInput component
//
// A headless input for entering Spain's Código de Identificación Fiscal (CIF).
// Format: 9 characters: 8 numbers and a control letter (the letters I, Ñ, O, and U are not used).
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
//   <EspanaCodigoDeIdentificacionFiscalInput label="Tax Identification Code" value={value} onChange={setValue} />
//
// Accessibility:
//   - aria-label provides the accessible name for screen readers
//   - autoComplete="off" protects sensitive identifiers
//   - required and disabled states are conveyed to assistive technology
//
// References:
//   - https://en.wikipedia.org/wiki/VAT_identification_number#Spain

import React from "react";

export interface EspanaCodigoDeIdentificacionFiscalInputProps {
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

export default function EspanaCodigoDeIdentificacionFiscalInput({
    className = "",
    label,
    value = "",
    required = false,
    disabled = false,
    onChange,
    ...restProps
}: EspanaCodigoDeIdentificacionFiscalInputProps) {
    return (
        <input
        className={`espana-codigo-de-identificacion-fiscal-input ${className}`}
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
