// ActionBarButton component
//
// One action button inside an ActionBar. The `label` prop is REQUIRED to
// provide an accessible name via aria-label, since the button content is
// often an icon or short glyph. Defaults to type="button" to avoid
// accidental form submissions.
//
// Props:
//   class   — string, optional. CSS class name.
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

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface ActionBarButtonProps {
    class?: string;
    /** aria-label for the button (required) */
    label: string;
    /** HTML button type */
    type?: "button" | "submit" | "reset";
    /** Whether the button is disabled */
    disabled?: boolean;
    /** Click event handler */
    onClick?: (event: MouseEvent) => void;
    /** Button content */
    children?: JSX.Element;
    [key: string]: unknown;
}

export default function ActionBarButton(props: ActionBarButtonProps) {
    const p = merge({ class: "" as const, type: "button" as const, disabled: false }, props);
    const restProps = omit(p, "class", "label", "type", "disabled", "onClick", "children");
    return (
        <button
            class={`action-bar-button ${p.class}`}
            type={p.type}
            disabled={p.disabled}
            aria-label={p.label}
            onClick={p.onClick}
            {...restProps}
        >
            {p.children}
        </button>
    );
}
