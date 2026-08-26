// MenuGroup component
//
// A labeled section of menu items within a menu. Inspired by Adobe Spectrum.
//
// Props:
//   className     — string, optional. CSS class name.
//   label         — string, REQUIRED. Section heading text (also used as aria-label).
//   children      — ReactNode, optional. The menu items.
//   ...restProps  — additional HTML attributes spread onto the root <div>.
//
// Behavior:
//   - Renders <div role="group" aria-label={label}>
//   - Renders a visible heading element marked aria-hidden="true" (since the
//     aria-label conveys the section name to assistive technology).
//
// Headless rules:
//   - No CSS, no inline styles
//   - All user-facing strings are consumer-supplied (i18n)
//
// References:
//   - Adobe Spectrum MenuGroup: https://spectrum.adobe.com/page/menu/

import React from "react";

export interface MenuGroupProps {
    className?: string;
    /** Section heading text (also used as aria-label) (required) */
    label: string;
    /** The menu items */
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function MenuGroup({
    className = "",
    label,
    children = undefined,
    ...restProps
}: MenuGroupProps) {
    return (
        <div
        className={`menu-group ${className}`}
        role="group"
        aria-label={label}
        {...restProps}
        >
            <div className="menu-group-heading" aria-hidden="true">{label}</div>
            {children}
        </div>
    );
}
