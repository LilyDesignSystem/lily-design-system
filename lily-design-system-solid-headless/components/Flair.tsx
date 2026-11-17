// Flair component
//
// A small inline element used to add visual emphasis, categorization, or status
// labeling to elements within an interface. Commonly used as tags, badges, or labels
// in forums, social platforms, or dashboards to indicate user roles, content types,
// statuses, or categories (e.g., "Moderator", "Urgent", "New").
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, default undefined. Accessible label; omit for decorative flair, provide for meaningful flair.
//   children — ReactNode, required. Flair content text.
//   ...restProps — additional HTML attributes spread onto the span.
//
// Syntax:
//   <Flair>New</Flair>
//
// Examples:
//
//   <Flair>New</Flair>
//
//
//   <Flair label="Status: new">New</Flair>
//
// Keyboard:
//   - None — this is a passive inline display element
//
// Accessibility:
//   - aria-hidden="true" applied when no label is provided, marking the flair as decorative
//   - aria-label applied when label is provided, giving the flair an accessible name
//
// Internationalization:
//   - All text content comes through the children prop and label prop; no hardcoded strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - When no label is provided, the flair is treated as decorative via aria-hidden
//   - When label is provided, aria-hidden is removed and the flair becomes meaningful

import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
import { attr } from "./attr";
export interface FlairProps {
    class?: string;
    /** Accessible label (omit for decorative). */
    label?: string;
    /** Flair content. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function Flair(props: FlairProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "children");
    return (
        <span
            class={`flair ${p.class}`}
            role={p.label ? "img" : undefined}
            aria-label={p.label}
            aria-hidden={attr(p.label ? undefined : "true")}
            {...restProps}
        >
            {p.children}
        </span>
    );
}
