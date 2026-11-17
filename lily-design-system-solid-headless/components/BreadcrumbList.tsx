// BreadcrumbList component
//
// An ordered list that contains BreadcrumbListItem children, representing
// the hierarchical trail in a breadcrumb navigation. Renders a semantic
// <ol> element to convey the ordered relationship of pages. Must be placed
// inside a BreadcrumbNav container.
//
// Props:
//   class — string, optional. CSS class name.
//   children — ReactNode, required. BreadcrumbListItem elements.
//   ...restProps — additional HTML attributes spread onto the <ol>.
//
// Syntax:
//   <BreadcrumbList>
//     <BreadcrumbListItem>...</BreadcrumbListItem>
//   </BreadcrumbList>
//
// Examples:
//
//   <BreadcrumbNav label="Breadcrumb">
//     <BreadcrumbList>
//       <BreadcrumbListItem><a href="/">Home</a></BreadcrumbListItem>
//       <BreadcrumbListItem><a href="/products">Products</a></BreadcrumbListItem>
//       <BreadcrumbListItem current>Widget</BreadcrumbListItem>
//     </BreadcrumbList>
//   </BreadcrumbNav>
//
// Keyboard: None — passive container. Keyboard interactions are handled
// by links within BreadcrumbListItem children.
//
// Accessibility:
//   - <ol> conveys the ordered hierarchical relationship of the trail
//   - Implicit list role allows screen readers to announce item count
//
// Internationalization:
//   - No user-facing strings; all content comes through children
//   - Separator characters (e.g. "/" or ">") should be added by the consumer
//
// Claude rules:
//   - Compound component — used inside BreadcrumbNav, contains BreadcrumbListItem children
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Separator characters between items are the consumer's responsibility
//
// References:
//   - WAI-ARIA Breadcrumb Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/

import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export interface BreadcrumbListProps {
    class?: string;
    /** BreadcrumbListItem elements. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function BreadcrumbList(props: BreadcrumbListProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(p, "class", "children");
    return (
        <ol
            class={`breadcrumb-list ${p.class}`}
            {...restProps}
        >
            {p.children}
        </ol>
    );
}
