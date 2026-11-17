// PaddingReset component
//
// PaddingReset for the Reuters-graphics-style article layout family. Renders a
// <div> that consumers style; this component is a structural
// wrapper only.
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Sets the padding-reset class as the styling hook

import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export interface PaddingResetProps {
    class?: string;
    /** Component content. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function PaddingReset(props: PaddingResetProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(p, "class", "children");
    return (
        <div
            class={`padding-reset ${p.class}`}
            {...restProps}
        >
            {p.children}
        </div>
    );
}
