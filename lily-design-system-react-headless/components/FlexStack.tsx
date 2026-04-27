// FlexStack component
//
// A headless flex layout container for vertical or horizontal stacking of
// children with a consistent gap. Accepts optional align-items and
// justify-content values for fine alignment.
//
// Props:
//   className — string, optional. CSS class name.
//   direction — "row" | "column", default "column".
//   gap       — string, default "1rem". CSS gap value.
//   align     — string, optional. align-items value.
//   justify   — string, optional. justify-content value.
//   children  — ReactNode, required. Items to stack.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <FlexStack direction="row" gap="0.5rem">…</FlexStack>
//
// Examples:
//
//   <FlexStack>
//     <p>Vertically stacked items.</p>
//     <p>With 1rem gap.</p>
//   </FlexStack>
//
//
//   <FlexStack direction="row" gap="1rem" align="center" justify="space-between">
//     <span>Left</span>
//     <span>Right</span>
//   </FlexStack>
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
//   - Headless: only inline style is the functional flex layout
//
// References:
//   - CSS Flexbox: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout

import React from "react";

export interface FlexStackProps {
    className?: string;
    /** Flex direction */
    direction?: "row" | "column";
    /** Gap between items (CSS value) */
    gap?: string;
    /** align-items value */
    align?: string;
    /** justify-content value */
    justify?: string;
    /** Items to stack */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function FlexStack({
    className = "",
    direction = "column",
    gap = "1rem",
    align = undefined,
    justify = undefined,
    children,
    ...restProps
}: FlexStackProps) {
    const style: React.CSSProperties = {
        display: "flex",
        flexDirection: direction,
        gap,
    };
    if (align !== undefined) style.alignItems = align;
    if (justify !== undefined) style.justifyContent = justify;
    return (
        <div
        className={`flex-stack ${className}`}
        data-direction={direction}
        style={style}
        {...restProps}
        >
        {children}
        </div>
    );
}
