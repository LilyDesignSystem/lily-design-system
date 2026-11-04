// WarningText component
//
// A short warning: an optional decorative icon and one bold line of text (the GOV.UK and DHCW
// warning-text pattern). The icon is the consumer's (Lily bundles none) and is hidden from
// assistive technology. The visually hidden prefix, such as "Warning", is part of the
// consumer's children, in the consumer's language; there is no prop or default for it.
//
// Props:
//   className — string, optional. CSS class name appended to the base class.
//   icon      — ReactNode, optional. Decorative icon, rendered inside an aria-hidden span.
//   children  — ReactNode, required. The hidden prefix, then the warning text.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <WarningText icon="!">
//     <span className="screen-reader-span">Warning</span> You can be fined if you do not register.
//   </WarningText>

import React from "react";

export interface WarningTextProps {
    className?: string;
    /** Decorative icon (aria-hidden) */
    icon?: React.ReactNode;
    /** The visually hidden prefix, then the warning text */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function WarningText({
    className = "",
    icon,
    children,
    ...restProps
}: WarningTextProps) {
    return (
        <div
            className={`warning-text ${className}`}
            {...restProps}
        >
            {icon != null && icon !== false && (
                <span
                    className="warning-text-icon"
                    aria-hidden="true"
                >
                    {icon}
                </span>
            )}
            <strong className="warning-text-text">{children}</strong>
        </div>
    );
}
