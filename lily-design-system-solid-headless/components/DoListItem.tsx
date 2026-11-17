// DoListItem component
//
// A single recommended-practice item within a "Do" list. Renders a semantic
// <li> element representing a guideline or best practice that users should
// follow. Commonly used in design system documentation, style guides, and
// instructional content to show approved patterns alongside DontListItem.
//
// The component sets data-recommendation="do" for consumer styling hooks,
// enabling visual differentiation (e.g. green checkmarks, success borders)
// without embedding any styles itself.
//
// Props:
//   class — string, optional. CSS class name.
//   children — ReactNode, required. The recommendation content.
//   ...restProps — additional HTML attributes spread onto the <li>.
//
// Syntax:
//   <DoListItem>Use semantic HTML elements</DoListItem>
//
// Examples:
//
//   <ul aria-label="Recommended practices">
//     <DoListItem>Use descriptive alt text for images</DoListItem>
//     <DoListItem>Provide visible focus indicators</DoListItem>
//     <DoListItem>Use sufficient color contrast</DoListItem>
//   </ul>
//
//
//   <ul aria-label="Do">
//     <DoListItem>Write clear error messages</DoListItem>
//   </ul>
//   <ul aria-label="Don't">
//     <DontListItem>Use technical jargon in errors</DontListItem>
//   </ul>
//
// Keyboard:
//   - None directly — passive informational display, not interactive
//
// Accessibility:
//   - Semantic <li> element provides list item semantics within the parent list
//   - Screen readers announce list position from the parent <ul> or <ol>
//   - data-recommendation attribute provides a hook for consumer styling
//
// Internationalization:
//   - All content is provided through the children prop
//   - No hardcoded strings in the component
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Should be placed inside a <ul> or <ol> for valid HTML
//   - Consumer can target [data-recommendation="do"] for visual styling
//
// References:
//   - MDN li element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li
//   - Material Design Do/Don't guidelines: https://m3.material.io/foundations/content-design/style-guide/overview

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface DoListItemProps {
    class?: string;
    /** The recommendation content. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function DoListItem(props: DoListItemProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "children");
    return (
        <li
            class={`do-list-item ${p.class}`}
            data-recommendation="do"
            {...restProps}
        >
            {p.children}
        </li>
    );
}
