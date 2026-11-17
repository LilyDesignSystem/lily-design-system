// IconButton component
//
// A headless button containing only an icon. Because the button has no
// visible text, the `label` prop is REQUIRED to provide an accessible name
// via aria-label. Defaults to type="button" to avoid accidental form
// submissions.
//
// Props:
//   class — string, optional. CSS class name.
//   baseClass — string, default "icon-button". The base class token itself
//     (replaces "icon-button" outright, not appended). A consumer whose own
//     contract requires an exact class (no extra "icon-button" token) sets
//     this instead of layering `class` on top of it.
//   label     — string, REQUIRED. aria-label for the button (accessible name).
//   type      — "button" | "submit" | "reset", default "button".
//   disabled  — boolean, default false.
//   pressed   — boolean | undefined, default undefined. Toggle state → aria-pressed.
//   onClick   — (event: MouseEvent) => void, optional. Click handler.
//   children  — JSX.Element, required. The icon content (svg, glyph, emoji).
//   ref       — reaches the rendered <button> (a ref is an ordinary prop in Solid),
//     so a consumer can call .focus() on it.
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
// Extends the real DOM attributes interface — rather than a `[key: string]:
// unknown` catch-all — so restProps (aria-haspopup, aria-expanded,
// aria-controls, onKeyDown, etc.) keep their real types.

import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";

import { attr } from "./attr";
import { warnMissingName } from "./dev-warning";

export interface IconButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
    class?: string;
    /** Base class token, replacing "icon-button" outright (not appended). */
    baseClass?: string;
    /** aria-label for the icon button (required for accessibility) */
    label: string;
    /** Toggle button pressed state (undefined = not a toggle) */
    pressed?: boolean;
    /** The icon content */
    children: JSX.Element;
}

// In Solid a ref is an ordinary prop: it reaches the <button> through the rest-props spread, so the other catalogs'
// forwardRef has no counterpart here.
export default function IconButton(props: IconButtonProps) {
    const p = withDefaults(
        { class: "", baseClass: "icon-button", type: "button" as const, disabled: false },
        props,
    );
    const restProps = omit(
        p,
        "class",
        "baseClass",
        "label",
        "type",
        "disabled",
        "pressed",
        "onClick",
        "children",
    );
    warnMissingName("IconButton", p.label, p["aria-labelledby"]);
    return (
        <button
            class={`${p.baseClass} ${p.class}`}
            type={p.type}
            disabled={p.disabled}
            aria-label={p.label}
            aria-pressed={attr(p.pressed)}
            onClick={p.onClick}
            {...restProps}
        >
            {p.children}
        </button>
    );
}
