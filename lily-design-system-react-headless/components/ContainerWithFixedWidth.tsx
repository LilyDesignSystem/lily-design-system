// ContainerWithFixedWidth component
//
// A headless centered content wrapper that constrains its children to a
// fixed maximum width. Centers itself horizontally within its parent using
// margin-inline: auto. The maximum width is applied via inline style and
// also exposed via a data-max-width attribute for consumer CSS hooks.
//
// Props:
//   className — string, optional. CSS class name.
//   maxWidth  — string, default "1200px". Max width CSS value.
//   children  — ReactNode, required. Content to display inside the container.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <ContainerWithFixedWidth maxWidth="960px">…</ContainerWithFixedWidth>
//
// Examples:
//
//   <ContainerWithFixedWidth>
//     <p>Default 1200px max width.</p>
//   </ContainerWithFixedWidth>
//
//
//   <ContainerWithFixedWidth maxWidth="64rem">
//     <article>Article content</article>
//   </ContainerWithFixedWidth>
//
// Keyboard: None — layout container.
//
// Accessibility:
//   - Purely structural; no ARIA role
//   - Content within preserves its own accessibility semantics
//
// Internationalization:
//   - No user-facing strings
//
// Claude rules:
//   - Headless: only inline style is the functional layout (max-width + margin-inline auto)
//
// References:
//   - CSS max-width: https://developer.mozilla.org/en-US/docs/Web/CSS/max-width

import React from "react";

export interface ContainerWithFixedWidthProps {
    className?: string;
    /** Max width CSS value, e.g. "1200px", "64rem" */
    maxWidth?: string;
    /** Content to display inside the container */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function ContainerWithFixedWidth({
    className = "",
    maxWidth = "1200px",
    children,
    ...restProps
}: ContainerWithFixedWidthProps) {
    return (
        <div
        className={`container-with-fixed-width ${className}`}
        style={{ maxWidth, marginInline: "auto" }}
        data-max-width={maxWidth}
        {...restProps}
        >
        {children}
        </div>
    );
}
