// EmailInput component
//
// A headless email input wrapping a native <input type="email"> with accessible
// labeling. Provides a streamlined API for basic email collection with required
// and disabled state support.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name via aria-label.
//   value — string, default "". Current email value; bindable.
//   required — boolean, default false. Whether the field is required.
//   disabled — boolean, default false. Whether the field is disabled.
//   ...restProps — additional HTML attributes spread onto the <input>.
//
// Syntax:
//   <EmailInput label="Your email" value={value} onChange={setValue} />
//
// Examples:
//
//   <EmailInput label="Your email" value={value} onChange={setValue} />
//
//
//   <EmailInput label="Contact email" value={value} onChange={setValue} required />
//
// Keyboard:
//   - None custom — keyboard behavior provided by the browser-native email input
//
// Accessibility:
//   - aria-label provides the accessible name since no visible <label> is included
//   - Native <input type="email"> provides built-in validation
//
// Internationalization:
//   - The label prop accepts any string; consumers provide localized text
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Uses controlled on value for two-way binding
//
// References:
//   - MDN input type="email": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email

import React from "react";

export interface EmailInputProps {
    className?: string;
    /** Accessible label. */
    label: string;
    /** Current value. Bindable. */
    value?: string;
    /** Whether required. */
    required?: boolean;
    /** Whether disabled. */
    disabled?: boolean;
    /** Callback when value changes. */
    onChange?: (value: string) => void;
    [key: string]: unknown;
}

export default function EmailInput({
    className = "",
    label,
    value = "",
    required = false,
    disabled = false,
    onChange,
    ...restProps
}: EmailInputProps) {
    return (
        <input
        className={`email-input ${className}`}
        type="email"
        aria-label={label}
        value={value} onChange={(e) => onChange?.(e.target.value)}
        required={required}
        disabled={disabled}
        {...restProps}
        />
    );
}
