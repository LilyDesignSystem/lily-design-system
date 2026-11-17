// ConvertFromValueDiv component
//
// A headless part of ConvertDiv: the value to convert from, such as a text input holding the number of dollars.
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
export interface ConvertFromValueDivProps {
    class?: string;
    /** The content. */
    children?: JSX.Element;
    [key: string]: unknown;
}

export default function ConvertFromValueDiv(props: ConvertFromValueDivProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(p, "class", "children");
    return (
        <div
            class={`convert-from-value-div ${p.class}`}
            {...restProps}
        >
            {p.children}
        </div>
    );
}
