// ConvertFromUnitDiv component
//
// A headless part of ConvertDiv: the unit to convert from, such as a select box of currencies or lengths.
// Contract: a plain <div> with the base class and children.
// Converts nothing and carries no strings of its own.
//
// Props:
//   class    -- string, optional. CSS class name.
//   children     -- ReactNode, optional. The content.
//   ...restProps -- additional HTML attributes spread onto the root.

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface ConvertFromUnitDivProps {
    class?: string;
    /** The content. */
    children?: JSX.Element;
    [key: string]: unknown;
}

export default function ConvertFromUnitDiv(props: ConvertFromUnitDivProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "children");
    return (
        <div
            class={`convert-from-unit-div ${p.class}`}
            {...restProps}
        >
            {p.children}
        </div>
    );
}
