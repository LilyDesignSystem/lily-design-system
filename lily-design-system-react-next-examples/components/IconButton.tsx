// IconButton component
//
// A headless button containing only an icon. Because the button has no
// visible text, the `label` prop is REQUIRED to provide an accessible name
// via aria-label. Defaults to type="button" to avoid accidental form
// submissions.
//
// Props:
//   className — string, optional. CSS class name.
//   baseClass — string, default "icon-button". The base class token itself
//     (replaces "icon-button" outright, not appended). A consumer whose own
//     contract requires an exact class (no extra "icon-button" token) sets
//     this instead of layering `className` on top of it.
//   label     — string, REQUIRED. aria-label for the button (accessible name).
//   type      — "button" | "submit" | "reset", default "button".
//   disabled  — boolean, default false.
//   pressed   — boolean | undefined, default undefined. Toggle state → aria-pressed.
//   onClick   — (event: React.MouseEvent) => void, optional. Click handler.
//   children  — ReactNode, required. The icon content (svg, glyph, emoji).
//   ref       — forwarded to the rendered <button> (React.forwardRef; this
//     package's peerDependencies span React 18 and 19, and plain `ref`
//     props only work on 19+, so forwardRef is required for a ref a
//     consumer can call .focus() on).
//   ...restProps — additional HTML attributes spread onto the <button>
//     (e.g. aria-haspopup, aria-expanded, aria-controls, onKeyDown).
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

// Extends the real DOM attributes interface — rather than a `[key: string]:
// unknown` catch-all — so restProps (aria-haspopup, aria-expanded,
// aria-controls, onKeyDown, etc.) keep their real types, and so
// React.forwardRef's `Omit<P, "ref">` machinery (which collapses named
// properties on an indexed type) doesn't choke during declaration-file
// generation.
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /** Base class token, replacing "icon-button" outright (not appended). */
    baseClass?: string;
    /** aria-label for the icon button (required for accessibility) */
    label: string;
    /** Toggle button pressed state (undefined = not a toggle) */
    pressed?: boolean;
    /** The icon content */
    children: React.ReactNode;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
    function IconButton(
        {
            className = "",
            baseClass = "icon-button",
            label,
            type = "button",
            disabled = false,
            pressed = undefined,
            onClick = undefined,
            children,
            ...restProps
        }: IconButtonProps,
        ref: React.ForwardedRef<HTMLButtonElement>,
    ) {
        return (
            <button
            className={`${baseClass} ${className}`}
            type={type}
            disabled={disabled}
            aria-label={label}
            aria-pressed={pressed}
            onClick={onClick}
            ref={ref}
            {...restProps}
            >
            {children}
            </button>
        );
    },
);

export default IconButton;
