// SummaryBox component
//
// A boxed callout that highlights key takeaways or next steps from a longer
// page. Inspired by the USWDS Summary box component. Renders an <aside>
// (complementary landmark) with a required heading and a body region for
// children. The aria-label defaults to the heading text but can be overridden.
//
// Props:
//   class — string, optional. CSS class name appended to the root.
//   heading   — string, REQUIRED. Box heading.
//   label     — string, optional. aria-label override (defaults to heading).
//   children  — ReactNode, required. Body content.
//   ...restProps — additional HTML attributes spread onto the <aside>.
//
// Syntax:
//   <SummaryBox heading="Key takeaways">
//     <ul><li>Plain language wins</li></ul>
//   </SummaryBox>
//
// Accessibility:
//   - <aside> is a complementary landmark
//   - aria-label provides the accessible name (defaults to heading)
//
// Internationalization:
//   - heading and label are consumer-supplied for localized text
//
// Claude rules:
//   - Headless: no CSS, no styles
//   - heading is non-optional in the interface
//
// References:
//   - USWDS Summary box: https://designsystem.digital.gov/components/summary-box/

import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export interface SummaryBoxProps {
    class?: string;
    /** Box heading (required) */
    heading: string;
    /** Optional aria-label override (defaults to heading) */
    label?: string;
    /** Body content */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function SummaryBox(props: SummaryBoxProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(p, "class", "heading", "label", "children");
    return (
        <aside
            class={`summary-box ${p.class}`}
            aria-label={p.label || p.heading}
            {...restProps}
        >
            <h3 class="summary-box-heading">{p.heading}</h3>
            <div class="summary-box-body">{p.children}</div>
        </aside>
    );
}
