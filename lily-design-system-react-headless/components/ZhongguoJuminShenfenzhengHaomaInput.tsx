// ZhongguoJuminShenfenzhengHaomaInput component
//
// A headless input for entering China's Resident Identity Card Number (居民身份证号码).
// Format: Eighteen characters under national standard GB 11643. The first six digits encode the region of registration; the next eight encode date of birth (YYYYMMDD); the next three are a sequence number whose last digit's parity encodes sex (odd male, even female); the eighteenth character is a check character computed with the ISO 7064:1983 MOD 11-2 algorithm over the first seventeen digits -- a value of 10 is written as the letter X.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". Bindable input value; supports value + onChange.
//   required — boolean, default false. Whether the input is required for form submission.
//   disabled — boolean, default false. Whether the input is disabled.
//   ...restProps — additional HTML attributes spread onto the <input>.
//
// Syntax:
//   <ZhongguoJuminShenfenzhengHaomaInput label="Resident Identity Card Number (居民身份证号码)" value={value} onChange={setValue} />
//
// Accessibility:
//   - aria-label provides the accessible name for screen readers
//   - autoComplete="off" protects sensitive identifiers
//   - required and disabled states are conveyed to assistive technology
//
// References:
//   - https://en.wikipedia.org/wiki/Resident_Identity_Card

import React from "react";

export interface ZhongguoJuminShenfenzhengHaomaInputProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The current value of the input, bindable */
    value?: string;
    /** Whether the input is required for form submission */
    required?: boolean;
    /** Whether the input is disabled */
    disabled?: boolean;
    /** Callback when value changes. */
    onChange?: (value: string) => void;
    [key: string]: unknown;
}

export default function ZhongguoJuminShenfenzhengHaomaInput({
    className = "",
    label,
    value = "",
    required = false,
    disabled = false,
    onChange,
    ...restProps
}: ZhongguoJuminShenfenzhengHaomaInputProps) {
    return (
        <input
        className={`zhongguo-jumin-shenfenzheng-haoma-input ${className}`}
        type="text"
        aria-label={label}
        autoComplete="off"
        value={value} onChange={(e) => onChange?.(e.target.value)}
        required={required}
        disabled={disabled}
        {...restProps}
        />
    );
}
