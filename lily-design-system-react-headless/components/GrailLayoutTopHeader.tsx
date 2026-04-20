// GrailLayoutTopHeader component
//
// A headless container for the top header section of a GrailLayout. It spans
// the full width of the layout and typically contains site branding, navigation,
// or a top bar.
//
// Props:
//   className — string, optional. CSS class name.
//   children — ReactNode, required. Content to render inside the top header section.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <GrailLayoutTopHeader>{children}</GrailLayoutTopHeader>
//
// Examples:
//   <GrailLayoutTopHeader><header>Site Header</header></GrailLayoutTopHeader>
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

export interface GrailLayoutTopHeaderProps {
    className?: string;
    /** Content to render inside the top header section. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function GrailLayoutTopHeader({
    className = "",
    children,
    ...restProps
}: GrailLayoutTopHeaderProps) {
    return (
        <header
        className={`grail-layout-top-header ${className}`}
        {...restProps}
        >
        {children}
        </header>
    );
}
