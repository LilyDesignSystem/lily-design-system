// PasswordInput component
//
// A headless password field using the native HTML <input type="password">
// element. It renders a single input that obscures the entered text. Unlike
// PasswordInputOrTextInputDiv, this component does not include a show/hide toggle — it
// is a simple, single-element password input. Includes autocomplete support
// for browser password manager integration.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name via aria-label.
//   value — string, default "". Current password value; bindable with value + onChange.
//   autocomplete — string, default "current-password". Autocomplete hint for browser password managers.
//   required — boolean, default false. Whether the field must be filled before form submission.
//   disabled — boolean, default false. Whether the input is disabled.
//   onChange — function, optional. Callback when value changes.
//   ...restProps — additional HTML attributes spread onto the <input>.
//
// Syntax:
//   <PasswordInput label="Password" value={value} onChange={setValue} />
//
// Examples:
//
//   <PasswordInput label="Password" value={value} onChange={setValue} />
//
//
//   <PasswordInput label="New password" value={value} onChange={setValue} autocomplete="new-password" />
//
//
//   <PasswordInput label="Mot de passe" value={value} onChange={setValue} required />
//
// Keyboard:
//   - Tab: moves focus to the input (standard behavior)
//   - Enter: submits the containing form (standard input behavior)
//
// Accessibility:
//   - aria-label provides the accessible name since there is no visible <label> element
//   - autocomplete="current-password" enables browser password manager integration
//   - Native <input type="password"> provides built-in text obscuring
//
// Internationalization:
//   - The label prop externalizes the accessible name for localization
//   - No other hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Value uses controlled pattern with value + onChange
//   - No visible <label> element — relies on aria-label
//
// References:
//   - MDN input type="password": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/password

import React from "react";

export interface PasswordInputProps {
    className?: string;
    /** Accessible label. */
    label: string;
    /** Current value. Bindable. */
    value?: string;
    /** Autocomplete hint. */
    autocomplete?: string;
    /** Whether required. */
    required?: boolean;
    /** Whether disabled. */
    disabled?: boolean;
    /** Callback when value changes. */
    onChange?: (value: string) => void;
    [key: string]: unknown;
}

export default function PasswordInput({
    className = "",
    label,
    value = "",
    autocomplete = "current-password",
    required = false,
    disabled = false,
    onChange,
    ...restProps
}: PasswordInputProps) {
    return (
        <input
        className={`password-input ${className}`}
        type="password"
        aria-label={label}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        autoComplete={autocomplete}
        required={required}
        disabled={disabled}
        {...restProps}
        />
    );
}
