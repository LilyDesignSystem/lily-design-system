// PhotoPack component
//
// PhotoPack for the Reuters-graphics-style article layout family. Renders a
// <div> (with role="group") that consumers style; this component is a structural
// wrapper only.
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Sets the photo-pack class as the styling hook

import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export interface PhotoPackProps {
    class?: string;
    /** Accessible label set on aria-label. */
    label: string;
    /** Component content. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function PhotoPack(props: PhotoPackProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "children");
    return (
        <div
            class={`photo-pack ${p.class}`}
            role="group"
            aria-label={p.label}
            {...restProps}
        >
            {p.children}
        </div>
    );
}
