// BreadcrumbNav component
//
// A navigation landmark for a breadcrumb trail that shows the user's current
// location within a site hierarchy. Renders a <nav> element with an accessible
// label. Contains a BreadcrumbList which holds BreadcrumbListItem children.
// Used in sites with deep hierarchies such as e-commerce catalogs,
// documentation, and content management systems.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, required. Accessible name for the navigation landmark.
//   children — ReactNode, required. BreadcrumbList element.
//   ...restProps — additional HTML attributes spread onto the <nav>.
//
// Syntax:
//   <BreadcrumbNav label="Breadcrumb">
//     <BreadcrumbList>...</BreadcrumbList>
//   </BreadcrumbNav>
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
// Keyboard:
//   - Tab: Focus moves between links in the breadcrumb trail
//   - Enter: Activates the focused breadcrumb link
//
// Accessibility:
//   - <nav> with aria-label creates a navigation landmark
//   - Screen readers announce the landmark name for orientation
//
// Internationalization:
//   - Label text comes through the label prop; no hardcoded strings
//
// Claude rules:
//   - Compound component — use with BreadcrumbList and BreadcrumbListItem
//   - Headless: no CSS, no styles — consumer provides all styling
//
// References:
//   - WAI-ARIA Breadcrumb Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/
//   - HTML nav element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav

import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
import { warnMissingName } from "./dev-warning";

export interface BreadcrumbNavProps {
    class?: string;
    /** Accessible label for the breadcrumb navigation. */
    label: string;
    /** BreadcrumbList element. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function BreadcrumbNav(props: BreadcrumbNavProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "children");
    warnMissingName("BreadcrumbNav", p.label, p["aria-label"], p["aria-labelledby"]);
    return (
        <nav
            class={`breadcrumb-nav ${p.class}`}
            aria-label={p.label}
            {...restProps}
        >
            {p.children}
        </nav>
    );
}
