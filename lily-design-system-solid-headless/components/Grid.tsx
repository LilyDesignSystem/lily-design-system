// Grid component
//
// A headless CSS grid layout container with a configurable column count or
// custom grid-template-columns string. When `columns` is a number, applies
// `repeat({columns}, minmax(0, 1fr))`; when it is a string, uses that string
// as-is for flexible track definitions.
//
// Props:
//   class — string, optional. CSS class name.
//   columns   — number | string, default 12.
//   minColumnWidth — string, optional. CSS length; when set, template is
//             repeat(auto-fit, minmax(min(<W>, 100%), 1fr)) and wins over `columns`.
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

import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
import { attr } from "./attr";
export interface GridProps {
    class?: string;
    /** Number of equal columns OR custom grid-template-columns string */
    columns?: number | string;
    /** CSS length: fit as many columns as fit, each at least this wide. Wins over `columns`. */
    minColumnWidth?: string;
    /** Gap between cells (CSS value) */
    gap?: string;
    /** Grid items */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function Grid(props: GridProps) {
    const p = withDefaults({ class: "" as const, columns: 12, gap: "1rem" as const }, props);
    const restProps = omit(p, "class", "columns", "minColumnWidth", "gap", "children");
    const gridTemplateColumns = (): string =>
        p.minColumnWidth
            ? `repeat(auto-fit, minmax(min(${p.minColumnWidth}, 100%), 1fr))`
            : typeof p.columns === "number"
              ? `repeat(${p.columns}, minmax(0, 1fr))`
              : p.columns;
    return (
        <div
            class={`grid ${p.class}`}
            data-columns={attr(String(p.columns))}
            data-min-column-width={attr(p.minColumnWidth || undefined)}
            style={{ display: "grid", "grid-template-columns": gridTemplateColumns(), gap: p.gap }}
            {...restProps}
        >
            {p.children}
        </div>
    );
}
