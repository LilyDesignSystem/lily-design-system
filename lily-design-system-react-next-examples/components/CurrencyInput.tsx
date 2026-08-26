// CurrencyInput component
//
// A locale-aware currency input rendered as a native <input type="text"
// inputmode="decimal"> so mobile keyboards show the numeric keypad while
// allowing the user to type a decimal separator. The component does not
// format the displayed value itself — formatting (Intl.NumberFormat,
// locale-specific separators, currency symbol placement) is the
// consumer's responsibility, since formatting rules vary by locale and
// design context. The currencyCode prop is exposed to the consumer
// purely so it can be passed straight through to Intl.NumberFormat.
//
// Props:
//   className    — string, optional. CSS class name.
//   label        — string, required. Accessible name via aria-label.
//   value        — number | undefined. Current numeric value (controlled).
//   onChange     — callback, optional. Receives the parsed number, or
//                  undefined if the input is empty / non-numeric.
//   currencyCode — string, default "USD". ISO 4217 currency code.
//   min, max     — number, optional. Min/max allowed value (constraints,
//                  not enforced clamping; consumer may layer that on).
//   required     — boolean, default false.
//   disabled     — boolean, default false.
//   ...restProps — additional HTML attributes spread onto the <input>.
//
// Accessibility:
//   - aria-label provides the accessible name (no visible <label> wrap)
//   - inputmode="decimal" triggers numeric keypad on mobile
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - No locale formatting baked in — consumer chooses how to display
//
// References:
//   - HTML text input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/text
//   - Intl.NumberFormat: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
//   - ISO 4217 Currency Codes: https://www.iso.org/iso-4217-currency-codes.html

import React from "react";

export interface CurrencyInputProps {
    className?: string;
    /** Accessible name via aria-label. */
    label: string;
    /** Current numeric value. */
    value?: number;
    /** Fired when the parsed number changes. */
    onChange?: (value: number | undefined) => void;
    /** ISO 4217 currency code (passed through for consumer formatting). */
    currencyCode?: string;
    /** Minimum allowed value. */
    min?: number;
    /** Maximum allowed value. */
    max?: number;
    /** Whether the input is required. */
    required?: boolean;
    /** Whether the input is disabled. */
    disabled?: boolean;
    [key: string]: unknown;
}

export default function CurrencyInput({
    className = "",
    label,
    value = undefined,
    onChange = undefined,
    currencyCode = "USD",
    min,
    max,
    required = false,
    disabled = false,
    ...restProps
}: CurrencyInputProps) {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const raw = event.target.value.trim();
        if (raw === "") {
            onChange?.(undefined);
            return;
        }
        const parsed = Number(raw);
        onChange?.(Number.isNaN(parsed) ? undefined : parsed);
    };

    return (
        <input
            type="text"
            inputMode="decimal"
            className={`currency-input ${className}`}
            aria-label={label}
            data-currency-code={currencyCode}
            value={value === undefined ? "" : String(value)}
            onChange={handleChange}
            min={min}
            max={max}
            required={required}
            disabled={disabled}
            {...restProps}
        />
    );
}
