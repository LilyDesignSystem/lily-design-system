// ConvertDiv component
//
// A headless part of ConvertDiv: a group that converts a value from one unit into another, such as dollars into euros or miles into kilometres.
// Contract: a plain <div> with the base class and children; role="group" named by `label`.
// Converts nothing and carries no strings of its own.
//
// Props:
//   class    -- string, optional. CSS class name.
//   label        -- string, required. Accessible name of the group (aria-label).
//   children     -- ReactNode, optional. The content.
//   ...restProps -- additional HTML attributes spread onto the root.

import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export interface ConvertDivProps {
    class?: string;
    /** Accessible name of the group. */
    label: string;
    /** The content. */
    children?: JSX.Element;
    [key: string]: unknown;
}

export default function ConvertDiv(props: ConvertDivProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "children");
    return (
        <div
            class={`convert-div ${p.class}`}
            role="group"
            aria-label={p.label}
            {...restProps}
        >
            {p.children}
        </div>
    );
}
