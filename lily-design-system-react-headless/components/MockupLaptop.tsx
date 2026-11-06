// MockupLaptop component
//
// A box area that looks like a laptop computer. Renders a decorative <div> container that
// the consumer styles to look like the named device or surface; useful in
// marketing pages, documentation, and component galleries to frame a
// screenshot or video preview.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, optional. Accessible name.
//   children — ReactNode, required. The content rendered inside the device frame.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Keyboard:
//   None — this is a passive decorative container.
//
// Accessibility:
//   - role="img", named by `label`: the mockup reads as one image.
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - No interactive behavior built in
//
// References:
//   - HTML div element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div

import React from "react";

export interface MockupLaptopProps {
    className?: string;
    /** Accessible name of the image of the device. */
    label?: string;
    /** Content rendered inside the device frame. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function MockupLaptop({
    className = "", label,
    children,
    ...restProps
}: MockupLaptopProps) {
    return (
        <div
            className={`mockup-laptop ${className}`}
            role="img"
            aria-label={label}
            {...restProps}
        >
            {children}
        </div>
    );
}
