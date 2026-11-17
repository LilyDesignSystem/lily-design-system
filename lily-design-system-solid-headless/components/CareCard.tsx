// CareCard component
//
// A headless healthcare guidance component inspired by NHS England care card
// patterns. Renders a <div role="group"> (not a landmark) with a heading and body content,
// supporting three urgency tiers: non-urgent (speak to a GP), urgent (visit
// A&E or call 111), and immediate (call 999). The data-type attribute enables
// consumer CSS styling based on urgency level.
//
// Props:
//   class — string, optional. CSS class name.
//   type — "non-urgent" | "urgent" | "immediate", default "non-urgent". Urgency level.
//   heading — string, required. Heading text describing the care action.
//   label — string, optional. aria-label override; defaults to heading text.
//   children — ReactNode, required. The care card body content.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <CareCard heading="See a GP if:">
//     <p>You have persistent symptoms.</p>
//   </CareCard>
//
// Examples:
//
//   <CareCard type="non-urgent" heading="Speak to a GP if:">
//     <ul><li>you have symptoms for more than 3 days</li></ul>
//   </CareCard>
//
//
//   <CareCard type="immediate" heading="Call 999 if:">
//     <ul><li>you have difficulty breathing</li></ul>
//   </CareCard>
//
// Keyboard:
//   None — this component is a passive content container.
//
// Accessibility:
//   - role="group" groups the heading and body under one name, without a landmark per card
//   - aria-label set from label prop or heading prop for screen reader identification
//   - <h2> heading provides document structure
//   - data-type exposes urgency level for consumer styling hooks
//
// Internationalization:
//   - All text comes through heading, label, and children props; no hardcoded strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Consumer uses data-type attribute to apply urgency-appropriate visual styles
//
// References:
//   - NHS England Care Cards: https://service-manual.nhs.uk/design-system/components/care-cards

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
import { attr } from "./attr";
export interface CareCardProps {
    class?: string;
    type?: "non-urgent" | "urgent" | "immediate";
    heading: string;
    label?: string;
    children: JSX.Element;
    [key: string]: unknown;
}

export default function CareCard(props: CareCardProps) {
    const p = merge({ class: "" as const, type: "non-urgent" as const }, props);
    const restProps = omit(p, "class", "type", "heading", "label", "children");
    return (
        <div
            class={`care-card ${p.class}`}
            role="group"
            aria-label={p.label ?? p.heading}
            data-type={attr(p.type)}
            {...restProps}
        >
            <h2>{p.heading}</h2>
            {p.children}
        </div>
    );
}
