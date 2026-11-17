// TreeNav component
//
// A headless navigation landmark for hierarchical / tree-style navigation.
// Renders a <nav> element with an accessible label. Wrap a TreeList inside
// for the actual ARIA tree role and keyboard navigation.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, required. Accessible name for the navigation landmark.
//   children — ReactNode, required. Typically a TreeList.
//   ...restProps — additional HTML attributes spread onto the <nav>.
//
// Syntax:
//   <TreeNav label="Site map">
//     <TreeList label="Pages">
//       <TreeListItem>...</TreeListItem>
//     </TreeList>
//   </TreeNav>
//
// Examples:
//   <TreeNav label="Documentation">
//     <TreeList label="Topics">
//       <li role="treeitem" tabIndex={0}>Getting started</li>
//       <li role="treeitem" tabIndex={-1}>Components</li>
//     </TreeList>
//   </TreeNav>
//
// Keyboard:
//   - Tab: Focus moves into and out of the navigation
//   - Tree-item navigation is provided by the inner TreeList
//
// Accessibility:
//   - <nav> with aria-label creates a navigation landmark
//   - Tree semantics live on the inner TreeList (role="tree" + role="treeitem")
//
// Internationalization:
//   - The label prop accepts any translated string
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - This component provides the landmark only; tree-pattern keyboard
//     navigation belongs on TreeList
//
// References:
//   - WAI-ARIA Navigation role: https://www.w3.org/TR/wai-aria-1.2/#navigation
//   - HTML nav element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
import { warnMissingName } from "./dev-warning";

export interface TreeNavProps {
    class?: string;
    /** Accessible label. */
    label: string;
    /** Tree content (typically a TreeList). */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function TreeNav(props: TreeNavProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "children");
    warnMissingName("TreeNav", p.label, p["aria-label"], p["aria-labelledby"]);
    return (
        <nav
            class={`tree-nav ${p.class}`}
            aria-label={p.label}
            {...restProps}
        >
            {p.children}
        </nav>
    );
}
