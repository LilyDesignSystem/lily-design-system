// AddressographBox component
//
// A printed or rendered block of patient identification details, traditionally
// applied to clinical paperwork by an addressograph-box machine. The component is
// passive structural markup — the consumer supplies the identifier lines as
// children (name, date of birth, NHS number, etc.).
//
// Props:
//   className — string, optional. CSS class name.
//   label    — string, optional. Accessible label via aria-label.
//   children — ReactNode, required. Component content.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Accessibility:
//   - aria-label exposes a screen-reader name when label is provided
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling

import React from "react";

export interface AddressographBoxProps {
    className?: string;
    /** Optional accessible label set on aria-label. */
    label?: string;
    /** Component content. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function AddressographBox({
    className = "",
    label = undefined,
    children,
    ...restProps
}: AddressographBoxProps) {
    return (
        <div
            className={`addressograph-box ${className}`}
            aria-label={label}
            {...restProps}
        >
            {children}
        </div>
    );
}
