// SelectWithExtras component
//
// A headless enhanced select that wraps a native <select> element with optional
// content areas before and after it. Allows consumers to place supplementary
// elements such as icons, flags, status indicators, or helper text alongside
// the select without breaking its accessibility. Preserves full native select
// behavior including keyboard navigation and form submission.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for the select via aria-label.
//   value — string, default "". Currently selected value; bindable with value + onChange.
//   required — boolean, default false. Whether the select is required for form validation.
//   disabled — boolean, default false. Whether the select is disabled.
//   children — ReactNode, required. <option> elements for the select.
//   before — ReactNode, optional. Content rendered before the select element.
//   after — ReactNode, optional. Content rendered after the select element.
//   ...restProps — additional HTML attributes spread onto the wrapper <div>.
//
// Syntax:
//   <SelectWithExtras label="Country" value={value} onChange={setValue}>
//     <option value="us">USA</option>
//   </SelectWithExtras>
//
// Examples:
//
//   <SelectWithExtras label="Country" value={value} onChange={setValue}
//     before={<span>Flag:</span>}>
//     <option value="us">USA</option>
//     <option value="uk">United Kingdom</option>
//   </SelectWithExtras>
//
//
//   <SelectWithExtras label="Unit" value={unit} onChange={setUnit}
//     after={<span>selected</span>}>
//     <option value="kg">Kilograms</option>
//     <option value="lb">Pounds</option>
//   </SelectWithExtras>
//
// Keyboard:
//   - Tab: moves focus to the native select element
//   - Arrow Up/Down: navigates between options (native select behavior)
//   - Space/Enter: opens the dropdown (native select behavior)
//   - Escape: closes the dropdown (native select behavior)
//
// Accessibility:
//   - aria-label on the <select> provides the accessible name
//   - Native <select> semantics are fully preserved
//
// Internationalization:
//   - The label prop externalizes the accessible name for localization
//   - Before/after prop content is consumer-provided for localization
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Value uses controlled for two-way binding with value + onChange
//   - restProps spread onto the wrapper <div>, not the <select>
//   - Before/after props are conditionally rendered only when provided
//
// References:
//   - HTML <select> element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select
//   - WAI-ARIA Listbox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/

import React from "react";

export interface SelectWithExtrasProps {
    className?: string;
    /** Accessible label. */
    label: string;
    /** Selected value. Bindable. */
    value?: string;
    /** Whether required. */
    required?: boolean;
    /** Whether disabled. */
    disabled?: boolean;
    /** Option elements. */
    children: React.ReactNode;
    /** Content before the select. */
    before?: React.ReactNode;
    /** Content after the select. */
    after?: React.ReactNode;
    /** Callback when value changes. */
    onChange?: (value: string) => void;
    [key: string]: unknown;
}

export default function SelectWithExtras({
    className = "",
    label,
    value = "",
    required = false,
    disabled = false,
    before,
    after,
    onChange,
    children,
    ...restProps
}: SelectWithExtrasProps) {
    return (
        <div
            className={`select-with-extras ${className}`}
            {...restProps}
        >
            {before && before}
            <select
                aria-label={label}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                required={required}
                disabled={disabled}
            >
                {children}
            </select>
            {after && after}
        </div>
    );
}
