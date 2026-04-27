// Grid component
//
// A headless CSS grid layout container with a configurable column count or
// custom grid-template-columns string. When `columns` is a number, applies
// `repeat({columns}, minmax(0, 1fr))`; when it is a string, uses that string
// as-is for flexible track definitions.
//
// Props:
//   className — string, optional. CSS class name.
//   columns   — number | string, default 12.
//   gap       — string, default "1rem". CSS gap value.
//   children  — ReactNode, required. Grid items.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <Grid columns={3} gap="1rem">…</Grid>
//
// Examples:
//
//   <Grid columns={3}>
//     <div>1</div><div>2</div><div>3</div>
//   </Grid>
//
//
//   <Grid columns="200px 1fr 200px" gap="2rem">
//     <aside>Left</aside>
//     <main>Center</main>
//     <aside>Right</aside>
//   </Grid>
//
// Keyboard: None — layout container.
//
// Accessibility:
//   - Purely structural; no ARIA role (use role="grid" only for interactive grids)
//
// Internationalization:
//   - No user-facing strings
//
// Claude rules:
//   - Headless: only inline style is the functional grid layout
//
// References:
//   - CSS Grid: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout

import React from "react";

export interface GridProps {
    className?: string;
    /** Number of equal columns OR custom grid-template-columns string */
    columns?: number | string;
    /** Gap between cells (CSS value) */
    gap?: string;
    /** Grid items */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function Grid({
    className = "",
    columns = 12,
    gap = "1rem",
    children,
    ...restProps
}: GridProps) {
    const gridTemplateColumns: string =
        typeof columns === "number"
            ? `repeat(${columns}, minmax(0, 1fr))`
            : columns;
    return (
        <div
        className={`grid ${className}`}
        data-columns={String(columns)}
        style={{ display: "grid", gridTemplateColumns, gap }}
        {...restProps}
        >
        {children}
        </div>
    );
}
