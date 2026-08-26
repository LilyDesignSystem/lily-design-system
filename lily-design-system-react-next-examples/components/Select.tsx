// Select component
//
// A headless wrapper around the native HTML <select> element for choosing one
// option from a dropdown list. The consumer provides <option> elements as
// children, giving full control over available choices. Commonly used in forms
// for selecting countries, categories, statuses, or other predefined values.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name via aria-label.
//   value — string, default "". Currently selected value; bindable with value + onChange.
//   required — boolean, default false. Whether the select is required for form submission.
//   disabled — boolean, default false. Whether the select is disabled.
//   children — ReactNode, required. <option> elements to render inside the select.
//   ...restProps — additional HTML attributes spread onto the <select>.
//
// Syntax:
//   <Select label="Country" value={value} onChange={setValue}>
//     <option value="us">United States</option>
//   </Select>
//
// Examples:
//
//   <Select label="Priority" value={priority} onChange={setPriority} required>
//     <option value="">Select priority...</option>
//     <option value="low">Low</option>
//     <option value="high">High</option>
//   </Select>
//
//
//   <Select label="Status" value={status} onChange={setStatus} disabled={isReadOnly}>
//     <option value="active">Active</option>
//     <option value="inactive">Inactive</option>
//   </Select>
//
// Keyboard:
//   - Tab: moves focus to/from the select (native browser behavior)
//   - Space/Enter: opens the dropdown list (native browser behavior)
//   - Arrow Up/Down: navigates through options (native browser behavior)
//   - Escape: closes the dropdown list (native browser behavior)
//   - Home/End: jumps to first/last option (native browser behavior)
//   - Type-ahead: typing characters jumps to matching options (native browser behavior)
//
// Accessibility:
//   - aria-label provides an accessible name since there is no visible <label> element
//   - Native <select> has implicit combobox/listbox role with built-in semantics
//
// Internationalization:
//   - The label prop externalizes the accessible name for localization
//   - Option text is provided by the consumer via children prop
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Value uses controlled for two-way binding with value + onChange
//   - Children prop renders <option> elements inside the native <select>
//
// References:
//   - MDN select element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select

import React from "react";

export interface SelectProps {
    className?: string;
    /** Accessible label. */
    label: string;
    /** Current selected value. Bindable. */
    value?: string;
    /** Whether required. */
    required?: boolean;
    /** Whether disabled. */
    disabled?: boolean;
    /** Option elements to render inside. */
    children: React.ReactNode;
    /** Callback when value changes. */
    onChange?: (value: string) => void;
    [key: string]: unknown;
}

export default function Select({
    className = "",
    label,
    value = "",
    required = false,
    disabled = false,
    onChange,
    children,
    ...restProps
}: SelectProps) {
    return (
        <select
        className={`select ${className}`}
        aria-label={label}
        value={value} onChange={(e) => onChange?.(e.target.value)}
        required={required}
        disabled={disabled}
        {...restProps}
        >
        {children}
        </select>
    );
}
