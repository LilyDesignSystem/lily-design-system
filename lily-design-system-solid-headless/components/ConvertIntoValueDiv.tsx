// ConvertIntoValueDiv component
//
// A headless part of ConvertDiv: the converted value, such as a text input showing the number of euros.
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
export interface ConvertIntoValueDivProps {
    class?: string;
    /** The content. */
    children?: JSX.Element;
    [key: string]: unknown;
}

export default function ConvertIntoValueDiv(props: ConvertIntoValueDivProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(p, "class", "children");
    return (
        <div
            class={`convert-into-value-div ${p.class}`}
            {...restProps}
        >
            {p.children}
        </div>
    );
}
