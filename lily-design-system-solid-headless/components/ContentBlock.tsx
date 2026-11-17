// ContentBlock component
//
// ContentBlock for the Reuters-graphics-style article layout family. Renders a
// <div> that consumers style; this component is a structural
// wrapper only. Sets data-width based on the width prop so consumer CSS can target presets.
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Sets the content-block class as the styling hook

import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
import { attr } from "./attr";
export interface ContentBlockProps {
    class?: string;
    /** Content width preset. */
    width?: "narrower" | "narrow" | "normal" | "wide" | "wider" | "widest" | "fluid";
    /** Component content. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function ContentBlock(props: ContentBlockProps) {
    const p = withDefaults({ class: "" as const, width: "normal" as const }, props);
    const restProps = omit(p, "class", "width", "children");
    return (
        <div
            class={`content-block ${p.class}`}
            data-width={attr(p.width)}
            {...restProps}
        >
            {p.children}
        </div>
    );
}
