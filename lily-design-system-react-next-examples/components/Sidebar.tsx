// Sidebar component
//
// A headless complementary region that uses the semantic <aside> element to
// provide a labeled landmark for content tangentially related to the main
// content. Commonly used for navigation menus, filters, related links, or
// supplementary information alongside the primary page content.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for the sidebar region via aria-label.
//   children — ReactNode, required. Content to render inside the sidebar.
//   ...restProps — additional HTML attributes spread onto the <aside>.
//
// Syntax:
//   <Sidebar label="Navigation">
//     <nav>...</nav>
//   </Sidebar>
//
// Examples:
//   
//   <Sidebar label="Filters">
//     <form>
//       <select><option>Category</option></select>
//     </form>
//   </Sidebar>
//
//   
//   <Sidebar label="Related articles">
//     <ul><li><a href="/article-1">Article 1</a></li></ul>
//   </Sidebar>
//
// Keyboard:
//   - None — this is a passive container. Keyboard navigation depends on interactive content inside.
//
// Accessibility:
//   - <aside> element has implicit complementary landmark role
//   - aria-label distinguishes this sidebar from other landmarks on the page
//   - Screen readers announce it as a complementary landmark
//
// Internationalization:
//   - The label prop externalizes the accessible label string
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - No internal state management — purely structural component
//   - Layout, width, positioning are entirely the consumer's responsibility
//
// References:
//   - WAI-ARIA Complementary Role: https://www.w3.org/TR/wai-aria-1.2/#complementary
//   - WAI-ARIA Landmark Regions: https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/
//   - HTML <aside> element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/aside

import React from "react";

export interface SidebarProps {
    className?: string;
    /** Accessible label. */
    label: string;
    /** Sidebar content. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function Sidebar({
    className = "",
    label,
    children,
    ...restProps
}: SidebarProps) {
    return (
        <aside
        className={`sidebar ${className}`}
        aria-label={label}
        {...restProps}
        >
        {children}
        </aside>
    );
}
