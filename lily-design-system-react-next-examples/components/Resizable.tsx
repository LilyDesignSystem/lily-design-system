// Resizable component
//
// A headless resizable container that renders a focusable <div> region with
// a data-resize attribute indicating the allowed resize direction. Used for
// adjustable panels, panes, code editors, sidebars, or preview areas where
// the user controls the container size.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name for the region via aria-label.
//   direction — "both" | "horizontal" | "vertical", default "both". Which directions resizing is allowed.
//   children — ReactNode, required. Content to render inside the container.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <Resizable label="Resizable panel" direction="both">
//     <p>Content</p>
//   </Resizable>
//
// Examples:
//   
//   <Resizable label="Sidebar" direction="horizontal">
//     <nav>Links</nav>
//   </Resizable>
//
//   
//   <Resizable label="Preview" direction="vertical">
//     <div>Preview content</div>
//   </Resizable>
//
// Keyboard:
//   - Tab: focuses the resizable region (tabindex="0")
//   - Consumer implements any keyboard-driven resize behavior
//
// Accessibility:
//   - role="region" identifies the container as a landmark
//   - aria-label provides the accessible name
//   - tabindex="0" makes the container keyboard-focusable
//   - data-resize attribute exposes the direction for CSS targeting
//
// Internationalization:
//   - The label prop externalizes the accessible label string
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Consumer must apply CSS resize and overflow properties based on data-resize
//   - No internal resize logic — purely structural and semantic
//
// References:
//   - WAI-ARIA Region Role: https://www.w3.org/TR/wai-aria-1.2/#region
//   - WAI-ARIA Window Splitter Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/

import React from "react";

export interface ResizableProps {
    className?: string;
    /** Accessible label. */
    label: string;
    /** Resize direction. */
    direction?: "both" | "horizontal" | "vertical";
    /** Content. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function Resizable({
    className = "",
    label,
    direction = "both",
    children,
    ...restProps
}: ResizableProps) {
    return (
        <div
        className={`resizable ${className}`}
        role="region"
        aria-label={label}
        tabIndex={0}
        data-resize={direction}
        {...restProps}
        >
        {children}
        </div>
    );
}
