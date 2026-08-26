// IconButton component
//
// A headless button containing only an icon. Because the button has no
// visible text, the `label` prop is REQUIRED to provide an accessible name
// via aria-label. Defaults to type="button" to avoid accidental form
// submissions.
//
// Props:
//   className — string, optional. CSS class name.
//   label     — string, REQUIRED. aria-label for the button (accessible name).
//   type      — "button" | "submit" | "reset", default "button".
//   disabled  — boolean, default false.
//   pressed   — boolean | undefined, default undefined. Toggle state → aria-pressed.
//   onClick   — (event: React.MouseEvent) => void, optional. Click handler.
//   children  — ReactNode, required. The icon content (svg, glyph, emoji).
//   ...restProps — additional HTML attributes spread onto the <button>.
//
// Syntax:
//   <IconButton label="Close" onClick={handleClose}>
//     <svg>…</svg>
//   </IconButton>
//
// Examples:
//
//   <IconButton label="Close dialog" onClick={onClose}>
//     <span aria-hidden="true">×</span>
//   </IconButton>
//
//
//   <IconButton label="Toggle mute" pressed={muted} onClick={toggle}>
//     <MuteIcon />
//   </IconButton>
//
// Keyboard:
//   - Tab: Focus the button
//   - Enter / Space: Activate the button
//
// Accessibility:
//   - aria-label is the accessible name (REQUIRED)
//   - aria-pressed when `pressed` is provided
//   - Native disabled attribute prevents activation
//
// Internationalization:
//   - The label prop is the only user-facing string and is consumer-supplied
//
// Claude rules:
//   - Headless: no CSS, no styles
//   - label is non-optional in the interface
//
// References:
//   - WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/

import React from "react";

export interface IconButtonProps {
    className?: string;
    /** aria-label for the icon button (required for accessibility) */
    label: string;
    /** HTML button type */
    type?: "button" | "submit" | "reset";
    /** Whether the button is disabled */
    disabled?: boolean;
    /** Toggle button pressed state (undefined = not a toggle) */
    pressed?: boolean;
    /** Click event handler */
    onClick?: (event: React.MouseEvent) => void;
    /** The icon content */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function IconButton({
    className = "",
    label,
    type = "button",
    disabled = false,
    pressed = undefined,
    onClick = undefined,
    children,
    ...restProps
}: IconButtonProps) {
    return (
        <button
        className={`icon-button ${className}`}
        type={type}
        disabled={disabled}
        aria-label={label}
        aria-pressed={pressed}
        onClick={onClick}
        {...restProps}
        >
        {children}
        </button>
    );
}
