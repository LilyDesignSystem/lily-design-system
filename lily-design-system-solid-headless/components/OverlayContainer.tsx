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
//   class — string, optional. CSS class name.
//   open      — boolean, default false. Whether the overlay is visible.
//   label     — string, optional. aria-label.
//   onClick   — (event: MouseEvent) => void, optional. Click handler (typically backdrop-close).
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

import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
import { attr } from "./attr";
export interface OverlayContainerProps {
    class?: string;
    /** Whether the overlay is open (visible) */
    open?: boolean;
    /** aria-label for the overlay */
    label?: string;
    /** Click handler (typically backdrop-close) */
    onClick?: (event: MouseEvent) => void;
    /** Overlay content */
    children?: JSX.Element;
    [key: string]: unknown;
}

export default function OverlayContainer(props: OverlayContainerProps) {
    const p = withDefaults({ class: "" as const, open: false }, props);
    const restProps = omit(p, "class", "open", "label", "onClick", "children");
    return (
        <div
            class={`overlay-container ${p.class}`}
            role="presentation"
            aria-hidden={attr(!p.open)}
            data-open={attr(p.open)}
            hidden={!p.open}
            aria-label={p.label}
            onClick={p.onClick}
            {...restProps}
        >
            {p.children}
        </div>
    );
}
