// ActionBarButton component
//
// One action button inside an ActionBar. The `label` prop is REQUIRED to
// provide an accessible name via aria-label, since the button content is
// often an icon or short glyph. Defaults to type="button" to avoid
// accidental form submissions.
//
// Props:
//   className   — string, optional. CSS class name.
//   label       — string, REQUIRED. aria-label for the button.
//   type        — "button" | "submit" | "reset", default "button".
//   disabled    — boolean, default false.
//   onClick     — click handler.
//   children    — ReactNode, optional. Button content (icon and/or text).
//   ...restProps — additional HTML attributes spread onto the <button>.
//
// Headless rules:
//   - No CSS, no inline styles
//   - All user-facing strings are consumer-supplied (i18n)
//
// References:
//   - Adobe Spectrum ActionBar: https://spectrum.adobe.com/page/action-bar/
//   - WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/

import React from "react";

export interface ActionBarButtonProps {
    className?: string;
    /** aria-label for the button (required) */
    label: string;
    /** HTML button type */
    type?: "button" | "submit" | "reset";
    /** Whether the button is disabled */
    disabled?: boolean;
    /** Click event handler */
    onClick?: (event: React.MouseEvent) => void;
    /** Button content */
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function ActionBarButton({
    className = "",
    label,
    type = "button",
    disabled = false,
    onClick = undefined,
    children = undefined,
    ...restProps
}: ActionBarButtonProps) {
    return (
        <button
        className={`action-bar-button ${className}`}
        type={type}
        disabled={disabled}
        aria-label={label}
        onClick={onClick}
        {...restProps}
        >
            {children}
        </button>
    );
}
