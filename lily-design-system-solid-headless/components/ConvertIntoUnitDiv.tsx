// ConvertIntoUnitDiv component
//
// A headless part of ConvertDiv: the unit to convert into, such as a select box of currencies or lengths.
// Contract: a plain <div> with the base class and children.
// Converts nothing and carries no strings of its own.
//
// Props:
//   class    -- string, optional. CSS class name.
//   children     -- ReactNode, optional. The content.
//   ...restProps -- additional HTML attributes spread onto the root.

import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export interface ConvertIntoUnitDivProps {
    class?: string;
    /** The content. */
    children?: JSX.Element;
    [key: string]: unknown;
}

export default function ConvertIntoUnitDiv(props: ConvertIntoUnitDivProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(p, "class", "children");
    return (
        <div
            class={`convert-into-unit-div ${p.class}`}
            {...restProps}
        >
            {p.children}
        </div>
    );
}
