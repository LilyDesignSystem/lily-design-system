// StreamingText component
//
// A polite live region for text that grows over time. While `streaming` is true the region is marked busy (`aria-busy="true"`, `data-streaming="true"`) so assistive technology waits instead of announcing every chunk; when it flips to false the finished text is announced once (`role="status"`, `aria-live="polite"`, `aria-atomic="true"`). The component never splits, times, reveals or animates the text: the consumer appends chunks to the children, and owns any caret or reduced-motion CSS.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, optional. Accessible name of the status region.
//   streaming — boolean, default false. True while chunks are still arriving.
//   children — ReactNode. The text so far.
//   ...restProps — additional HTML attributes spread onto the root <div>.
//
// Keyboard: none.

import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
import { attr } from "./attr";
export interface StreamingTextProps {
    class?: string;
    /** Accessible name of the region. */
    label?: string;
    /** Whether text is still arriving. */
    streaming?: boolean;
    /** The text so far. */
    children?: JSX.Element;
    [key: string]: unknown;
}

export default function StreamingText(props: StreamingTextProps) {
    const p = withDefaults({ class: "" as const, streaming: false }, props);
    const restProps = omit(p, "class", "label", "streaming", "children");
    return (
        <div
            class={`streaming-text ${p.class}`}
            role="status"
            aria-live="polite"
            aria-atomic="true"
            aria-label={p.label}
            aria-busy={attr(p.streaming ? "true" : undefined)}
            data-streaming={attr(p.streaming ? "true" : undefined)}
            {...restProps}
        >
            {p.children}
        </div>
    );
}
