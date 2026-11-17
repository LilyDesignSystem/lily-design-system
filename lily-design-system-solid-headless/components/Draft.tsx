// Draft component
//
// A passive container marking content that is unpublished or in progress. The
// consumer supplies the draft body as children and optionally a status string
// describing the stage of the draft, which is reflected as a data-status
// attribute the consumer's CSS or JS can observe.
//
// Props:
//   class — string, optional. CSS class name.
//   label    — string, optional. Accessible label via aria-label.
//   status   — string, optional. Stage of the draft, reflected as data-status.
//   children — ReactNode, required. Component content.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Accessibility:
//   - aria-label exposes a screen-reader name when label is provided
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - status is exposed via data-status, not ARIA — it's for the consumer

import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
import { attr } from "./attr";
export interface DraftProps {
    class?: string;
    /** Optional accessible label set on aria-label. */
    label?: string;
    /** Optional draft stage, reflected as data-status. */
    status?: string;
    /** Component content. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function Draft(props: DraftProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "status", "children");
    return (
        <div
            class={`draft ${p.class}`}
            role={p.label ? "group" : undefined}
            aria-label={p.label}
            data-status={attr(p.status)}
            {...restProps}
        >
            {p.children}
        </div>
    );
}
