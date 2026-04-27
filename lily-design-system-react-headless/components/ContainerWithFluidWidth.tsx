// ContainerWithFluidWidth component
//
// A headless full-width content wrapper that fills its parent's inline size
// and applies a configurable horizontal padding. The padding value is set
// inline and also exposed via a data-padding-inline attribute for consumer
// CSS hooks.
//
// Props:
//   className     — string, optional. CSS class name.
//   paddingInline — string, default "1rem". Horizontal padding CSS value.
//   children      — ReactNode, required. Content to display inside the container.
//   ...restProps  — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <ContainerWithFluidWidth paddingInline="2rem">…</ContainerWithFluidWidth>
//
// Examples:
//
//   <ContainerWithFluidWidth>
//     <p>Default 1rem horizontal padding.</p>
//   </ContainerWithFluidWidth>
//
//
//   <ContainerWithFluidWidth paddingInline="clamp(1rem, 4vw, 3rem)">
//     <main>Responsive padding.</main>
//   </ContainerWithFluidWidth>
//
// Keyboard: None — layout container.
//
// Accessibility:
//   - Purely structural; no ARIA role
//
// Internationalization:
//   - No user-facing strings
//
// Claude rules:
//   - Headless: only inline style is the functional layout (width + padding-inline)
//
// References:
//   - CSS padding-inline: https://developer.mozilla.org/en-US/docs/Web/CSS/padding-inline

import React from "react";

export interface ContainerWithFluidWidthProps {
    className?: string;
    /** Horizontal padding CSS value */
    paddingInline?: string;
    /** Content to display inside the container */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function ContainerWithFluidWidth({
    className = "",
    paddingInline = "1rem",
    children,
    ...restProps
}: ContainerWithFluidWidthProps) {
    return (
        <div
        className={`container-with-fluid-width ${className}`}
        style={{ width: "100%", paddingInline }}
        data-padding-inline={paddingInline}
        {...restProps}
        >
        {children}
        </div>
    );
}
