// ThemeSelectButton component
//
// One button in a theme picker, representing a single theme that the user
// can select. Renders as a <button> with aria-pressed reflecting whether
// this theme is currently the active one. Used inside a ThemeSelect to
// provide one button per theme.
//
// Props:
//   className — string, optional. CSS class name.
//   label    — string, required. Accessible label describing the theme.
//   pressed  — boolean, default false. Whether this theme is selected.
//   disabled — boolean, default false. Whether the button is disabled.
//   onClick  — callback, optional. Click handler.
//   children — ReactNode, optional. Button content (icon, swatch, label).
//   ...restProps — additional HTML attributes spread onto the <button>.
//
// Accessibility:
//   - Implicit button role from the <button> element
//   - aria-pressed communicates toggle state for the active theme
//   - aria-label provides a name when the visual content is not text
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Always renders type="button" so it does not submit a surrounding form

import React from "react";

export interface ThemeSelectButtonProps {
    className?: string;
    /** Accessible label describing the theme. */
    label: string;
    /** Whether this theme is currently selected. */
    pressed?: boolean;
    /** Whether the button is disabled. */
    disabled?: boolean;
    /** Click handler. */
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    /** Button content (icon, swatch, label). */
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function ThemeSelectButton({
    className = "",
    label,
    pressed = false,
    disabled = false,
    onClick = undefined,
    children,
    ...restProps
}: ThemeSelectButtonProps) {
    return (
        <button
            type="button"
            className={`theme-select-button ${className}`}
            aria-pressed={pressed}
            aria-label={label}
            disabled={disabled}
            onClick={onClick}
            {...restProps}
        >
            {children}
        </button>
    );
}
