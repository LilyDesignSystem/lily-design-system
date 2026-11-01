// VietNamCanCuocCongDanView component
//
// A headless display component for showing Viet Nam's
// Citizen Identification Number (CCCD) in a read-only format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <VietNamCanCuocCongDanView label="Citizen Identification Number (CCCD)" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://en.wikipedia.org/wiki/Vietnamese_identity_card

import React from "react";

export interface VietNamCanCuocCongDanViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function VietNamCanCuocCongDanView({
    className = "",
    label,
    value = "",
    ...restProps
}: VietNamCanCuocCongDanViewProps) {
    return (
        <span
            className={`viet-nam-can-cuoc-cong-dan-view ${className}`}
            aria-label={label}
            {...restProps}
        >
            {value}
        </span>
    );
}
