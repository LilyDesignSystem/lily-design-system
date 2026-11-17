// ContentsList component
//
// A headless ordered list for a table of contents. Renders a semantic <ol>
// element containing ContentsListItem children. Designed to be placed inside
// a ContentsNav component. The ordered list conveys the sequential nature of
// page sections to assistive technology.
//
// Props:
//   class — string, optional. CSS class name.
//   children — ReactNode, required. ContentsListItem components or <li> elements.
//   ...restProps — additional HTML attributes spread onto the <ol>.
//
// Syntax:
//   <ContentsList>
//     <ContentsListItem><a href="#section">Section</a></ContentsListItem>
//   </ContentsList>
//
// Examples:
//
//   <ContentsNav label="On this page">
//     <ContentsList>
//       <ContentsListItem><a href="#introduction">Introduction</a></ContentsListItem>
//       <ContentsListItem><a href="#usage">Usage</a></ContentsListItem>
//     </ContentsList>
//   </ContentsNav>
//
// Keyboard:
//   - None — passive list container; keyboard navigation handled by links within items
//
// Accessibility:
//   - <ol> provides implicit list role conveying sequential section order
//
// Internationalization:
//   - All content is provided by consumers through children; no hardcoded strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Compound component: used inside ContentsNav, contains ContentsListItem children
//
// References:
//   - MDN ol element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol

import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export interface ContentsListProps {
    class?: string;
    /** The component content */
    children?: JSX.Element;
    [key: string]: unknown;
}

export default function ContentsList(props: ContentsListProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(p, "class", "children");
    return (
        <ol
            class={`contents-list ${p.class}`}
            {...restProps}
        >
            {p.children}
        </ol>
    );
}
