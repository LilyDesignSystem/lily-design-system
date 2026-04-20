// GrailLayoutBottomFooter component
//
// A headless container for the bottom footer section of a GrailLayout. It spans
// the full width of the layout and typically contains copyright, links, or
// site-wide footer content.
//
// Props:
//   className — string, optional. CSS class name.
//   children — ReactNode, required. Content to render inside the bottom footer section.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <GrailLayoutBottomFooter>{children}</GrailLayoutBottomFooter>
//
// Examples:
//   <GrailLayoutBottomFooter><footer>Site Footer</footer></GrailLayoutBottomFooter>
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

export interface GrailLayoutBottomFooterProps {
    className?: string;
    /** Content to render inside the bottom footer section. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function GrailLayoutBottomFooter({
    className = "",
    children,
    ...restProps
}: GrailLayoutBottomFooterProps) {
    return (
        <footer
        className={`grail-layout-bottom-footer ${className}`}
        {...restProps}
        >
        {children}
        </footer>
    );
}
