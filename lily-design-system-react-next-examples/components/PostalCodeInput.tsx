// PostalCodeInput component
//
// A headless text input for entering postal or ZIP codes with
// autocomplete="postal-code" for browser autofill support. It renders a native
// <input type="text"> (not type="number", since postal codes may contain letters
// or dashes) with a bindable value for two-way data binding. Commonly used in
// address forms, checkout flows, shipping calculators, and location-based inputs.
// Pairs with PostalCodeView for the Input/View pattern.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name via aria-label.
//   value — string, default "". Current postal code value; bindable with value + onChange.
//   required — boolean, default false. Whether the field is required.
//   disabled — boolean, default false. Whether the field is disabled.
//   ...restProps — additional HTML attributes spread onto the <input>.
//
// Syntax:
//   <PostalCodeInput label="Postal code" value={value} onChange={setValue} />
//
// Examples:
//
//   <PostalCodeInput label="Postal code" value={value} onChange={setValue} />
//
//
//   <PostalCodeInput label="ZIP code" value={zipCode} onChange={setZipCode} required />
//
//
//   <PostalCodeInput label="Postcode" value={postcode} onChange={setPostcode} placeholder="SW1A 1AA" />
//
// Keyboard:
//   None beyond native input behavior — standard text editing keys
//   (typing, backspace, selection, clipboard-copy-button shortcuts) handled by the browser.
//
// Accessibility:
//   - aria-label provides an accessible name since no visible <label> is included
//   - autocomplete="postal-code" hints browser autofill for postal code fields
//
// Internationalization:
//   - The label prop is the only user-facing text; no hardcoded strings
//   - Consumer can pass pattern, placeholder, and maxlength via restProps for locale-specific formats
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Uses type="text" not type="number" to support alphanumeric postal codes
//   - Do not wrap in a <div> — renders a bare <input> element
//   - Do not add postal code validation — consumer handles format checking
//
// References:
//   - HTML autocomplete attribute: https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
//   - MDN input type="text": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/text

import React from "react";

export interface PostalCodeInputProps {
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

export default function PostalCodeInput({
    className = "",
    label,
    value = "",
    required = false,
    disabled = false,
    onChange,
    ...restProps
}: PostalCodeInputProps) {
    return (
        <input
        className={`postal-code-input ${className}`}
        type="text"
        aria-label={label}
        autoComplete="postal-code"
        value={value} onChange={(e) => onChange?.(e.target.value)}
        required={required}
        disabled={disabled}
        {...restProps}
        />
    );
}
