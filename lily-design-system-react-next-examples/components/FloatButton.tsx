// FloatButton component
//
// A floating action button anchored to a viewport corner. Inline `style` is
// `position: fixed` plus the corner offsets (1rem from each edge of the
// chosen corner). The corner is also exposed as `data-position` for consumer
// CSS hooks.
//
// Props:
//   className    — string, optional. CSS class name.
//   label        — string, REQUIRED. aria-label (button has icon-only content).
//   position     — "top-left" | "top-right" | "bottom-left" | "bottom-right",
//                  default "bottom-right". Viewport corner anchor.
//   disabled     — boolean, default false.
//   type         — "button" | "submit" | "reset", default "button".
//   onClick      — (event: React.MouseEvent) => void, optional.
//   children     — ReactNode, required. Icon content.
//   ...restProps — additional HTML attributes spread onto the <button>.
//
// Syntax:
//   <FloatButton label="Scroll to top" position="bottom-right" onClick={onTop}>
//     <ArrowUp />
//   </FloatButton>
//
// Accessibility:
//   - aria-label is REQUIRED (icon-only)
//   - implicit button role
//
// Internationalization:
//   - The label prop is the only user-facing string and is consumer-supplied
//
// Claude rules:
//   - Headless: no CSS classes beyond the base + consumer className.
//   - Inline `style` only for documented behavior (position: fixed + offsets).
//
// References:
//   - Ant Design FloatButton: https://ant.design/components/float-button

import React from "react";

export type FloatButtonPosition =
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right";

export interface FloatButtonProps {
    className?: string;
    /** aria-label for the icon-only button (required) */
    label: string;
    /** Viewport corner anchor */
    position?: FloatButtonPosition;
    /** Whether the button is disabled */
    disabled?: boolean;
    /** HTML button type */
    type?: "button" | "submit" | "reset";
    /** Click event handler */
    onClick?: (event: React.MouseEvent) => void;
    /** Icon content */
    children: React.ReactNode;
    [key: string]: unknown;
}

function cornerStyle(position: FloatButtonPosition): React.CSSProperties {
    const style: React.CSSProperties = { position: "fixed" };
    if (position === "top-left") {
        style.top = "1rem";
        style.left = "1rem";
    } else if (position === "top-right") {
        style.top = "1rem";
        style.right = "1rem";
    } else if (position === "bottom-left") {
        style.bottom = "1rem";
        style.left = "1rem";
    } else {
        style.bottom = "1rem";
        style.right = "1rem";
    }
    return style;
}

export default function FloatButton({
    className = "",
    label,
    position = "bottom-right",
    disabled = false,
    type = "button",
    onClick = undefined,
    children,
    ...restProps
}: FloatButtonProps) {
    return (
        <button
            className={`float-button ${className}`}
            type={type}
            disabled={disabled}
            aria-label={label}
            data-position={position}
            style={cornerStyle(position)}
            onClick={onClick}
            {...restProps}
        >
            {children}
        </button>
    );
}
