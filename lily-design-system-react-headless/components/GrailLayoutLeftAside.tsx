// GrailLayoutLeftAside component
//
// A headless container for the left aside section of a GrailLayout. It
// typically contains navigation menus, filters, or supplementary content.
//
// Props:
//   className — string, optional. CSS class name.
//   children — ReactNode, required. Content to render inside the left aside.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <GrailLayoutLeftAside>{children}</GrailLayoutLeftAside>
//
// Examples:
//   <GrailLayoutLeftAside><nav>Navigation menu</nav></GrailLayoutLeftAside>
//
// Keyboard:
//   - None. Structural layout component with no interactive behavior.
//
// Accessibility:
//   - No explicit ARIA attributes; consumers use semantic landmarks within sections
//
// Internationalization:
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling

import React from "react";

export interface GrailLayoutLeftAsideProps {
    className?: string;
    /** Content to render inside the left aside. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function GrailLayoutLeftAside({
    className = "",
    children,
    ...restProps
}: GrailLayoutLeftAsideProps) {
    return (
        <aside
        className={`grail-layout-left-aside ${className}`}
        {...restProps}
        >
        {children}
        </aside>
    );
}
