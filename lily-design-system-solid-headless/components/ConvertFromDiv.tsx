// ConvertFromDiv component
//
// A headless part of ConvertDiv: the source side of a conversion, holding the value and unit to convert from.
// Contract: a plain <div> with the base class and children.
// Converts nothing and carries no strings of its own.
//
// Props:
//   class    -- string, optional. CSS class name.
//   children     -- ReactNode, optional. The content.
//   ...restProps -- additional HTML attributes spread onto the root.

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface ConvertFromDivProps {
    class?: string;
    /** The content. */
    children?: JSX.Element;
    [key: string]: unknown;
}

export default function ConvertFromDiv(props: ConvertFromDivProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "children");
    return (
        <div
            class={`convert-from-div ${p.class}`}
            {...restProps}
        >
            {p.children}
        </div>
    );
}
