// OverlayContainer component
//
// A headless overlay backdrop for modals and sheets. Renders a presentational
// <div role="presentation"> that is hidden when `open` is false (via the
// HTML `hidden` attribute and aria-hidden). The component does not provide
// any visual styling itself — consumer CSS is responsible for the backdrop
// fill and positioning. The contained dialog/sheet/menu provides its own
// role (e.g. role="dialog").
//
// Props:
//   className — string, optional. CSS class name.
//   open      — boolean, default false. Whether the overlay is visible.
//   label     — string, optional. aria-label.
//   onClick   — (event: React.MouseEvent) => void, optional. Click handler (typically backdrop-close).
//   children  — ReactNode, optional. Overlay content.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <OverlayContainer open={isOpen} onClick={handleBackdropClick}>
//     <Dialog>…</Dialog>
//   </OverlayContainer>
//
// Examples:
//
//   <OverlayContainer open={open} onClick={() => setOpen(false)}>
//     <div role="dialog" aria-modal="true">…</div>
//   </OverlayContainer>
//
// Keyboard: None on the overlay itself; the contained dialog handles keys.
//
// Accessibility:
//   - role="presentation" — the overlay is decorative; the actual dialog has role=dialog
//   - aria-hidden mirrors the inverse of `open`
//   - hidden attribute applied when not open
//
// Internationalization:
//   - Optional label is consumer-supplied
//
// Claude rules:
//   - Headless: no CSS, no styles
//   - When closed, the element renders with `hidden` attribute and aria-hidden=true
//
// References:
//   - WAI-ARIA Modal Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/

import React from "react";

export interface OverlayContainerProps {
    className?: string;
    /** Whether the overlay is open (visible) */
    open?: boolean;
    /** aria-label for the overlay */
    label?: string;
    /** Click handler (typically backdrop-close) */
    onClick?: (event: React.MouseEvent) => void;
    /** Overlay content */
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function OverlayContainer({
    className = "",
    open = false,
    label = undefined,
    onClick = undefined,
    children = undefined,
    ...restProps
}: OverlayContainerProps) {
    return (
        <div
        className={`overlay-container ${className}`}
        role="presentation"
        aria-hidden={!open}
        data-open={open}
        hidden={!open}
        aria-label={label}
        onClick={onClick}
        {...restProps}
        >
        {children}
        </div>
    );
}
