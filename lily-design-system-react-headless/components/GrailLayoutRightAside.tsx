// GrailLayoutRightAside component
//
// A headless container for the right aside section of a GrailLayout. It
// typically contains supplementary content, ads, related links, or contextual
// information.
//
// Props:
//   className — string, optional. CSS class name.
//   children — ReactNode, required. Content to render inside the right aside.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <GrailLayoutRightAside>{children}</GrailLayoutRightAside>
//
// Examples:
//   <GrailLayoutRightAside><aside>Supplementary content</aside></GrailLayoutRightAside>
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

export interface GrailLayoutRightAsideProps {
    className?: string;
    /** Content to render inside the right aside. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function GrailLayoutRightAside({
    className = "",
    children,
    ...restProps
}: GrailLayoutRightAsideProps) {
    return (
        <aside
        className={`grail-layout-right-aside ${className}`}
        {...restProps}
        >
        {children}
        </aside>
    );
}
