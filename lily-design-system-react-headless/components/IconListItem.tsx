// IconListItem component
//
// One item in an IconList with an optional leading icon slot and required
// text content. The icon is supplied via the `icon` ReactNode prop (NOT
// children). The `children` prop is the textual content of the item. The
// icon span is decorative and uses aria-hidden so the accessible content
// is the text.
//
// Props:
//   className — string, optional. CSS class name appended to the root.
//   icon      — ReactNode, optional. Leading icon content.
//   children  — ReactNode, required. Text content of the item.
//   ...restProps — additional HTML attributes spread onto the <li>.
//
// Syntax:
//   <IconListItem icon={<Check />}>Saves time</IconListItem>
//
// Accessibility:
//   - The native <li> provides list-item semantics
//   - The icon span has aria-hidden="true" (decorative)
//   - The accessible content is the text (children)
//
// Internationalization:
//   - All user-facing text is consumer-supplied via children
//
// Claude rules:
//   - Headless: no CSS, no styles
//   - children is required (the text); icon is a separate ReactNode prop
//
// References:
//   - USWDS Icon list: https://designsystem.digital.gov/components/icon-list/

import React from "react";

export interface IconListItemProps {
    className?: string;
    /** Leading icon content (decorative, aria-hidden) */
    icon?: React.ReactNode;
    /** Text content of the item */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function IconListItem({
    className = "",
    icon,
    children,
    ...restProps
}: IconListItemProps) {
    return (
        <li
        className={`icon-list-item ${className}`}
        {...restProps}
        >
        {icon && (
            <span className="icon-list-item-icon" aria-hidden="true">
                {icon}
            </span>
        )}
        <span className="icon-list-item-text">{children}</span>
        </li>
    );
}
