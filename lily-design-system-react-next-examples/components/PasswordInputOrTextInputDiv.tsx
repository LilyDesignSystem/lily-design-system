// PasswordInputOrTextInputDiv component
//
// A headless password input with an optional show/hide toggle button. It renders
// a wrapper <div> containing an <input> that dynamically switches between
// type="password" and type="text", plus a toggle button with aria-pressed state.
// Includes autocomplete="current-password" for browser password manager support.
// Commonly used in login forms, registration forms, and account settings.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name for the password input via aria-label.
//   value — string, default "". Current password value; bindable with value + onChange.
//   showToggle — boolean, default true. Whether to render the show/hide toggle button.
//   toggleLabel — string, default "Show password". Accessible label for the toggle button.
//   required — boolean, default false. Whether the input is required.
//   disabled — boolean, default false. Whether the input is disabled.
//   ...restProps — additional HTML attributes spread onto the wrapper <div>.
//
// Syntax:
//   <PasswordInputOrTextInputDiv label="Password" value={value} onChange={setValue} />
//
// Examples:
//
//   <PasswordInputOrTextInputDiv label="Password" value={value} onChange={setValue} />
//
//
//   <PasswordInputOrTextInputDiv label="Password" value={value} onChange={setValue} showToggle={false} />
//
//
//   <PasswordInputOrTextInputDiv label="Mot de passe" value={value} onChange={setValue} toggleLabel="Afficher le mot de passe" />
//
// Keyboard:
//   - Enter/Space on the toggle button: toggles password visibility
//
// Accessibility:
//   - aria-label on the input provides the accessible name
//   - aria-label on the toggle button describes its purpose
//   - aria-pressed on the toggle button indicates current visibility state
//   - autocomplete="current-password" enables browser password manager integration
//
// Internationalization:
//   - The label and toggleLabel props are the only user-facing strings
//   - Default toggleLabel is "Show password"; override for other locales
//   - No other hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Uses internal useState() for visibility; not exposed as a prop
//   - restProps spread onto the wrapper <div>, not the <input>
//
// References:
//   - HTML password input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/password
//   - WAI-ARIA Button Pattern (toggle): https://www.w3.org/WAI/ARIA/apg/patterns/button/

import React, { useState } from "react";

export interface PasswordInputOrTextInputDivProps {
    className?: string;
    label: string;
    value?: string;
    showToggle?: boolean;
    toggleLabel?: string;
    required?: boolean;
    disabled?: boolean;
    /** Callback when value changes. */
    onChange?: (value: string) => void;
    [key: string]: unknown;
}

export default function PasswordInputOrTextInputDiv({
    className = "",
    label,
    value = "",
    showToggle = true,
    toggleLabel = "Show password",
    required = false,
    disabled = false,
    onChange,
    ...restProps
}: PasswordInputOrTextInputDivProps) {
    const [visible, setVisible] = useState(false);

    return (
        <div
        className={`password-input-or-text-input-div ${className}`}
        {...restProps}
        >
        <input
        type={visible ? "text" : "password"}
        aria-label={label}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        required={required}
        disabled={disabled}
        autoComplete="current-password"
        />
        {showToggle && (
        <button
        type="button"
        aria-label={toggleLabel}
        aria-pressed={visible}
        onClick={() => setVisible(!visible)}
        >
        {toggleLabel}
        </button>
        )}
        </div>
    );
}
