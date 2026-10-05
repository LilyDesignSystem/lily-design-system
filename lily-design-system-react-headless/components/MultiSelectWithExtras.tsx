// MultiSelectWithExtras component
//
// A wrapper <div> with optional before/after content around a native
// <select multiple>. The accessible name sits on the select, not the wrapper.
//
// Props:
//   className -- string, optional. CSS class name (wrapper).
//   label -- string, required. aria-label on the <select>.
//   value -- string[], default []. Selected values; onChange receives the array.
//   size -- number, optional. Visible rows.
//   required, disabled -- standard form props (on the select).
//   before, after -- ReactNode, optional. Content around the select.
//   children -- Option elements.
//   ...restProps -- spread onto the wrapper <div>.
//
// Keyboard: native <select multiple>.

import React, { useEffect, useState } from "react";

export interface MultiSelectWithExtrasProps {
    className?: string;
    /** Accessible label (on the select). */
    label: string;
    /** Selected values. Bindable. */
    value?: string[];
    /** Visible rows. */
    size?: number;
    /** Whether required. */
    required?: boolean;
    /** Whether disabled. */
    disabled?: boolean;
    /** Option elements. */
    children?: React.ReactNode;
    /** Content before the select. */
    before?: React.ReactNode;
    /** Content after the select. */
    after?: React.ReactNode;
    /** Callback when the selection changes. */
    onChange?: (value: string[]) => void;
    [key: string]: unknown;
}

export default function MultiSelectWithExtras({
    className = "",
    label,
    value: valueProp = [],
    size = undefined,
    required = false,
    disabled = false,
    before,
    after,
    onChange,
    children,
    ...restProps
}: MultiSelectWithExtrasProps) {
    const [value, setValue] = useState<string[]>(valueProp);
    const key = valueProp.join("\u0000");
    useEffect(() => {
        setValue(valueProp);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key]);

    return (
        <div className={`multi-select-with-extras ${className}`} {...restProps}>
            {before && before}
            <select
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
            >
                {children}
            </select>
            {after && after}
        </div>
    );
}
