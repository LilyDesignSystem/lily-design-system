// MultiSelect component
//
// A headless multiple-selection list wrapping the native <select multiple>.
// Native keyboard and pointer behaviour only; value is a string array.
//
// Props:
//   className -- string, optional. CSS class name.
//   label -- string, required. Accessible name via aria-label.
//   value -- string[], default []. Selected option values; onChange receives the array.
//   size -- number, optional. Visible rows.
//   required, disabled -- standard form props.
//   children -- Option elements.
//   ...restProps -- spread onto the <select>.
//
// Keyboard: native <select multiple> (arrows, Shift/Ctrl+click, Space).
// Accessibility: native listbox role; aria-label={label}.
// Internationalization: label is consumer-supplied.

import React, { useEffect, useState } from "react";

export interface MultiSelectProps {
    className?: string;
    /** Accessible label. */
    label: string;
    /** Selected values. Bindable. */
    value?: string[];
    /** Visible rows. */
    size?: number;
    /** Whether required. */
    required?: boolean;
    /** Whether disabled. */
    disabled?: boolean;
    /** Option elements to render inside. */
    children?: React.ReactNode;
    /** Callback when the selection changes. */
    onChange?: (value: string[]) => void;
    [key: string]: unknown;
}

export default function MultiSelect({
    className = "",
    label,
    value: valueProp = [],
    size = undefined,
    required = false,
    disabled = false,
    onChange,
    children,
    ...restProps
}: MultiSelectProps) {
    const [value, setValue] = useState<string[]>(valueProp);
    const key = valueProp.join("\u0000");
    useEffect(() => {
        setValue(valueProp);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key]);

    return (
        <select
            className={`multi-select ${className}`}
            multiple
            aria-label={label}
            size={size}
            value={value}
            onChange={(e) => {
                const next = Array.from(e.target.selectedOptions).map((o) => o.value);
                setValue(next);
                onChange?.(next);
            }}
            required={required}
            disabled={disabled}
            {...restProps}
        >
            {children}
        </select>
    );
}
