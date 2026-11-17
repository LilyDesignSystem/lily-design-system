// TimelineListItem component
//
// A single event entry within a TimelineList ordered list. Renders a semantic
// <li> element containing an optional <time> element for machine-readable dates
// and an optional heading, followed by descriptive content via children. Used
// for project milestones, activity feeds, order histories, or any chronological
// sequence of events.
//
// Props:
//   class — string, optional. CSS class name.
//   datetime — string, optional. ISO date/time string for the <time> element.
//   heading — string, optional. Visible date/time text rendered inside the <time> element.
//   children — ReactNode, required. Event description content.
//   ...restProps — additional HTML attributes spread onto the <li>.
//
// Syntax:
//   <TimelineListItem datetime="2024-01-15" heading="Jan 15">Event description</TimelineListItem>
//
// Examples:
//
//   <TimelineList label="Order history">
//     <TimelineListItem datetime="2024-01-15" heading="January 15, 2024">
//       Order placed
//     </TimelineListItem>
//     <TimelineListItem datetime="2024-01-16" heading="January 16, 2024">
//       Order shipped
//     </TimelineListItem>
//     <TimelineListItem datetime="2024-01-19" heading="January 19, 2024">
//       Order delivered
//     </TimelineListItem>
//   </TimelineList>
//
//
//   <TimelineListItem>Status pending review</TimelineListItem>
//
// Keyboard:
//   - None directly -- standard list item with no interactive behavior
//
// Accessibility:
//   - Semantic <li> element provides list item semantics within the parent <ol>
//   - <time> element with datetime attribute provides machine-readable date
//   - Screen readers announce list position (e.g. "2 of 4") from the parent <ol>
//
// Internationalization:
//   - The heading prop accepts any translated date/time string
//   - All content is provided through the children prop
//   - No hardcoded strings in the component
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - Compound component: must be used inside a TimelineList
//   - Consumer can target <time> or data attributes for visual styling
//
// References:
//   - HTML <time> element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time
//   - WAI-ARIA listitem role: https://www.w3.org/TR/wai-aria-1.2/#listitem

import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
import { attr } from "./attr";
import { warnMissingProp } from "./dev-warning";

export interface TimelineListItemProps {
    class?: string;
    /** ISO date/time string for the <time> element. */
    datetime?: string;
    /** Visible date/time text for the <time> element. */
    heading?: string;
    /** withheld: content not shown, only the words; entered-in-error: content kept in a <del>, with the words. data-entry-state */
    entryState?: "withheld" | "entered-in-error";
    /** That state in the consumer's words; required with entryState. */
    entryStateLabel?: string;
    /** Event description content. */
    children: JSX.Element;
    /** Additional HTML attributes spread onto the <li>. */
    [key: string]: unknown;
}

export default function TimelineListItem(props: TimelineListItemProps) {
    const p = withDefaults(
        { class: "" as const, datetime: "" as const, heading: "" as const },
        props,
    );
    const restProps = omit(
        p,
        "class",
        "datetime",
        "heading",
        "entryState",
        "entryStateLabel",
        "children",
    );
    if (p.entryState)
        warnMissingProp(
            "TimelineListItem",
            "entryStateLabel",
            p.entryStateLabel,
            "a withheld or in-error entry must say so in words.",
        );
    return (
        <li
            class={`timeline-list-item ${p.class}`}
            data-entry-state={attr(p.entryState)}
            {...restProps}
        >
            {(p.datetime || p.heading) && (
                <time datetime={p.datetime || undefined}>{p.heading}</time>
            )}
            {p.entryState === "withheld" ? (
                <span class="timeline-list-item-entry-state">{p.entryStateLabel}</span>
            ) : p.entryState === "entered-in-error" ? (
                <>
                    <del class="timeline-list-item-entry">{p.children}</del>
                    <span class="timeline-list-item-entry-state">{p.entryStateLabel}</span>
                </>
            ) : (
                p.children
            )}
        </li>
    );
}
