// GrailLayoutCenterMain component
//
// A headless container for the center main content section of a GrailLayout. It
// holds the primary page content and is flanked by the left and right sidebars.
//
// Props:
//   className — string, optional. CSS class name.
//   children — ReactNode, required. Content to render inside the center main section.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <GrailLayoutCenterMain>{children}</GrailLayoutCenterMain>
//
// Examples:
//   <GrailLayoutCenterMain><main>Primary content</main></GrailLayoutCenterMain>
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

export interface GrailLayoutCenterMainProps {
    className?: string;
    /** Content to render inside the center main content section. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function GrailLayoutCenterMain({
    className = "",
    children,
    ...restProps
}: GrailLayoutCenterMainProps) {
    return (
        <main
        className={`grail-layout-center-main ${className}`}
        {...restProps}
        >
        {children}
        </main>
    );
}
