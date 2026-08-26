// Input component
//
// A foundational form input component for text entry with accessible labeling and
// two-way value binding. Renders a native <input> element supporting various HTML
// input types such as text, email, password, number, search, and more. Provides
// required and disabled attributes and spreads additional props for full consumer control.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name applied via aria-label.
//   value — string, default "". Bindable current input value via value + onChange.
//   type — string, default "text". HTML input type attribute (e.g., "text", "email", "password", "number").
//   required — boolean, default false. Whether the input is required for form submission.
//   disabled — boolean, default false. Whether the input is disabled.
//   ...restProps — additional HTML attributes spread onto the input element.
//
// Syntax:
//   <Input label="Search" value={value} onChange={setValue} />
//
// Examples:
//
//   <Input label="Search" value={value} onChange={setValue} />
//
//
//   <Input label="Name" value={value} onChange={setValue} type="text" required />
//
//
//   <Input label="Email address" value={value} onChange={setValue} type="email" required disabled={isSubmitting} />
//
// Keyboard:
//   - Tab: Focus the input (native browser behavior)
//   - Standard text editing keys are supported natively
//
// Accessibility:
//   - aria-label provides an accessible name since there is no built-in visible <label> element
//   - Consumer can add aria-describedby for linked hint text
//
// Internationalization:
//   - The label prop allows localized accessible names; no hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Uses controlled for two-way binding of the input text
//   - Consumer can pass placeholder, maxlength, pattern, etc. via restProps
//
// References:
//   - MDN Input element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input
//   - WAI Forms Tutorial: https://www.w3.org/WAI/tutorials/forms/

import React from "react";

export interface InputProps {
    className?: string;
    label: string;
    value?: string;
    type?: string;
    required?: boolean;
    disabled?: boolean;
    /** Callback when value changes. */
    onChange?: (value: string) => void;
    [key: string]: unknown;
}

export default function Input({
    className = "",
    label,
    value = "",
    type = "text",
    required = false,
    disabled = false,
    onChange,
    ...restProps
}: InputProps) {
    return (
        <input
        className={`input ${className}`}
        type={type}
        aria-label={label}
        value={value} onChange={(e) => onChange?.(e.target.value)}
        required={required}
        disabled={disabled}
        {...restProps}
        />
    );
}
