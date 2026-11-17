// AccordionList component
//
// AccordionList elements within an AccordionNav. Provides an optional
// accessible label for the list.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, optional. Accessible name for the list via aria-label.
//   children — ReactNode, required. AccordionListItem elements.
//   ...restProps — additional HTML attributes spread onto the <ol>.
//
// Syntax:
//   <AccordionNav>
//     <AccordionList>
//       <AccordionListItem>...</AccordionListItem>
//     </AccordionList>
//   </AccordionNav>
//
// Examples:
//   <AccordionNav label="My Nav">
//     <AccordionList label="Questions">
//       <AccordionListItem>
//         <summary>What is this?</summary>
//         <p>A design system.</p>
//       </AccordionListItem>
//     </AccordionList>
//  </AccordionNav>
//
// Keyboard: None — passive container. Keyboard interactions are handled
// by AccordionListItem children.
//
// Accessibility:
//   - An <ol>, so screen readers announce how many sections there are and where each one is; aria-label optionally names it
//
// Internationalization:
//   - The label prop accepts any translated string
//   - No hardcoded text
//
// Claude rules:
//   - Compound component — used inside AccordionNav, contains AccordionListItem children
//   - Headless: no CSS, no styles — consumer provides all styling
//
// References:
//   - HTML ol element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface AccordionListProps {
    class?: string;
    /** Optional accessible label for the group. */
    label?: string;
    /** AccordionListItem elements. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function AccordionList(props: AccordionListProps) {
    const p = merge({ class: "" as const, label: "" as const }, props);
    const restProps = omit(p, "class", "label", "children");
    return (
        <ol
            class={`accordion-list ${p.class}`}
            aria-label={p.label || undefined}
            {...restProps}
        >
            {p.children}
        </ol>
    );
}
