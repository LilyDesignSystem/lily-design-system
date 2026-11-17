// FloatButton component
//
// A floating action button anchored to a viewport corner. Inline `style` is
// `position: fixed` plus the corner offsets (1rem from each edge of the
// chosen corner). The corner is also exposed as `data-position` for consumer
// CSS hooks.
//
// Props:
//   class    — string, optional. CSS class name.
//   label        — string, REQUIRED. aria-label (button has icon-only content).
//   position     — "top-left" | "top-right" | "bottom-left" | "bottom-right",
//                  default "bottom-right". Viewport corner anchor.
//   disabled     — boolean, default false.
//   type         — "button" | "submit" | "reset", default "button".
//   onClick      — (event: MouseEvent) => void, optional.
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
//   - Headless: no CSS classes beyond the base + consumer class.
//   - Inline `style` only for documented behavior (position: fixed + offsets).
//
// References:
//   - Ant Design FloatButton: https://ant.design/components/float-button

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
import { attr } from "./attr";
export type FloatButtonPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export interface FloatButtonProps {
    class?: string;
    /** aria-label for the icon-only button (required) */
    label: string;
    /** Viewport corner anchor */
    position?: FloatButtonPosition;
    /** Whether the button is disabled */
    disabled?: boolean;
    /** HTML button type */
    type?: "button" | "submit" | "reset";
    /** Click event handler */
    onClick?: (event: MouseEvent) => void;
    /** Icon content */
    children: JSX.Element;
    [key: string]: unknown;
}

function cornerStyle(position: FloatButtonPosition): JSX.CSSProperties {
    const style: JSX.CSSProperties = { position: "fixed" };
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

export default function FloatButton(props: FloatButtonProps) {
    const p = merge(
        {
            class: "" as const,
            position: "bottom-right" as const,
            disabled: false,
            type: "button" as const,
        },
        props,
    );
    const restProps = omit(
        p,
        "class",
        "label",
        "position",
        "disabled",
        "type",
        "onClick",
        "children",
    );
    return (
        <button
            class={`float-button ${p.class}`}
            type={p.type}
            disabled={p.disabled}
            aria-label={p.label}
            data-position={attr(p.position)}
            style={cornerStyle(p.position)}
            onClick={p.onClick}
            {...restProps}
        >
            {p.children}
        </button>
    );
}
