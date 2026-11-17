// SuccessPanel component
//
// A confirmation panel shown after an action succeeds. Renders a <div> with the `success-panel` hook;
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, optional. Accessible name, rendered as aria-label on the root.
//   children — JSX.Element, required. The confirmation heading and text.
//   ...restProps — additional HTML attributes spread onto the root <div>.
//
// Syntax:
//   <SuccessPanel label="…">…</SuccessPanel>
//
// Examples:
//   <SuccessPanel label="Saved"><h2>Saved</h2><p>Your changes were saved.</p></SuccessPanel>
//
// Keyboard:
//   - None -- not interactive; any interactive children handle their own keys
//
// Accessibility:
//   - aria-label comes from `label` when given
//   - role="status" on the root, so the label is valid
//
// Internationalization:
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//
// References:
//   - WAI-ARIA status role: https://www.w3.org/TR/wai-aria-1.2/#status

import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export interface SuccessPanelProps {
    class?: string;
    label?: string;
    children: JSX.Element;
    [key: string]: unknown;
}

export default function SuccessPanel(props: SuccessPanelProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "children");
    return (
        <div
            class={`success-panel ${p.class}`}
            role="status"
            aria-label={p.label}
            {...restProps}
        >
            {p.children}
        </div>
    );
}
