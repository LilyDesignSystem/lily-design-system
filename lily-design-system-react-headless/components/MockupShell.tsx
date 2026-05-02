// MockupShell component
//
// A box area that looks like a terminal shell. Renders a decorative <div> container that
// the consumer styles to look like the named device or surface; useful in
// marketing pages, documentation, and component galleries to frame a
// screenshot or video preview.
//
// Props:
//   className — string, optional. CSS class name.
//   children — ReactNode, required. The content rendered inside the device frame.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Keyboard:
//   None — this is a passive decorative container.
//
// Accessibility:
//   - No specific ARIA. If the children are an image of UI, set role="img"
//     and aria-label on the image element so assistive tech describes it.
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - No interactive behavior built in
//
// References:
//   - HTML div element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div

import React from "react";

export interface MockupShellProps {
    className?: string;
    /** Content rendered inside the device frame. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function MockupShell({
    className = "",
    children,
    ...restProps
}: MockupShellProps) {
    return (
        <div
            className={`mockup-shell ${className}`}
            {...restProps}
        >
            {children}
        </div>
    );
}
