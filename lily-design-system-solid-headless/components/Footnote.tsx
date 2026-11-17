// Footnote component
//
// A footnote provides supplementary information, citations, or clarifications that
// support the main content without cluttering it. Commonly used in articles, academic
// writing, legal documents, and documentation. Renders a <span role="note"> (not an <aside>, so no landmark per footnote)
// with role="note", and each footnote is identified by a unique id for in-page linking.
//
// Props:
//   class — string, optional. CSS class name.
//   id — string, required. Unique footnote identifier, used for the element id.
//   children — ReactNode, required. Footnote content (text, links, citations).
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <Footnote id="fn1">Source: Example et al., 2024</Footnote>
//
// Examples:
//
//   <Footnote id="fn1">Source: Example et al., 2024</Footnote>
//
//
//   <p>This claim is supported by research.<a href="#fn1"><sup>1</sup></a></p>
//   <Footnote id="fn1">
//     <a href="#ref1">1.</a> Example, A. (2024). Research Title. Journal Name.
//   </Footnote>
//
// Keyboard:
//   - None — this is a passive container; keyboard navigation handled by interactive child elements
//
// Accessibility:
//   - role="note" indicates supplementary content related to the main content
//   - The id attribute enables in-page linking from superscript reference markers
//
// Internationalization:
//   - All content comes through the children prop; no hardcoded user-facing strings
//   - The id is not a name; a reference such as fn-1 links to it
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Uses <span role="note"> for supplementary content
//   - Consumer is responsible for creating in-page links to the footnote
//
// References:
//   - WAI-ARIA note role: https://www.w3.org/TR/wai-aria-1.2/#note
//   - MDN note role: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/note_role

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface FootnoteProps {
    class?: string;
    /** Unique footnote identifier. */
    id: string;
    /** Footnote content. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function Footnote(props: FootnoteProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "id", "children");
    return (
        <span
            class={`footnote ${p.class}`}
            id={p.id}
            role="note"
            {...restProps}
        >
            {p.children}
        </span>
    );
}
