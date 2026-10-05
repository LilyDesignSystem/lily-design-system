// OneTimePasswordInput component
//
// A headless one-time-password (OTP / verification code) field: ONE native
// <input type="text"> (not segmented boxes) so SMS autofill, paste and the
// platform numeric keypad all work. Length is capped natively via maxLength.
//
// Props:
//   className -- string, optional. CSS class name.
//   label -- string, required. Accessible name via aria-label.
//   length -- number, required. Characters in the code. No default.
//   value -- string, default "". Controlled; supports value + onChange.
//   inputMode -- string, default "numeric". Virtual keyboard hint.
//   pattern -- string, default "[0-9]*". Allowed characters.
//   name, required, disabled -- standard form props.
//   ...restProps -- spread onto the <input>.
//
// Keyboard: none beyond native text editing.
// Accessibility: aria-label={label}; autocomplete="one-time-code".
// Internationalization: label is consumer-supplied; no hardcoded strings.

import React from "react";

export interface OneTimePasswordInputProps {
    className?: string;
    /** Accessible label. */
    label: string;
    /** Number of characters in the code. */
    length: number;
    /** Current value. Bindable. */
    value?: string;
    /** Virtual keyboard hint. */
    inputMode?: string;
    /** Allowed characters pattern. */
    pattern?: string;
    /** Form field name. */
    name?: string;
    /** Whether required. */
    required?: boolean;
    /** Whether disabled. */
    disabled?: boolean;
    /** Callback when value changes. */
    onChange?: (value: string) => void;
    [key: string]: unknown;
}

export default function OneTimePasswordInput({
    className = "",
    label,
    length,
    value = "",
    inputMode = "numeric",
    pattern = "[0-9]*",
    name = undefined,
    required = false,
    disabled = false,
    onChange,
    ...restProps
}: OneTimePasswordInputProps) {
    return (
        <input
            className={`one-time-password-input ${className}`}
            type="text"
            inputMode={inputMode as React.HTMLAttributes<HTMLInputElement>["inputMode"]}
            autoComplete="one-time-code"
            maxLength={length}
            pattern={pattern}
            spellCheck={false}
            autoCapitalize="off"
            aria-label={label}
            data-length={length}
            name={name}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            required={required}
            disabled={disabled}
            {...restProps}
        />
    );
}
