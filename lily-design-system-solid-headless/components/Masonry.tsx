// Masonry component
//
// A headless masonry-style layout container that arranges children into a
// configurable number of columns using the CSS columns model. Children with
// variable heights flow into columns automatically. Consumer CSS should set
// `break-inside: avoid` on direct children to keep items from splitting
// across columns.
//
// Props:
//   class — string, optional. CSS class name.
//   columns   — number, default 3. Number of columns.
//   gap       — string, default "1rem". Column gap CSS value.
//   children  — ReactNode, required. Items to lay out.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <Masonry columns={3} gap="1rem">…</Masonry>
//
// Examples:
//
//   <Masonry columns={4}>
//     {photos.map(p => <img src={p.url} alt={p.alt} />)}
//   </Masonry>
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
//   - Headless: only inline style is the functional CSS columns layout
//
// References:
//   - CSS columns: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_columns

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
import { attr } from "./attr";
export interface MasonryProps {
    class?: string;
    /** Number of columns */
    columns?: number;
    /** Gap between columns (CSS value) */
    gap?: string;
    /** Items to lay out */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function Masonry(props: MasonryProps) {
    const p = merge({ class: "" as const, columns: 3, gap: "1rem" as const }, props);
    const restProps = omit(p, "class", "columns", "gap", "children");
    return (
        <div
            class={`masonry ${p.class}`}
            data-columns={attr(p.columns)}
            style={{ "column-count": p.columns, "column-gap": p.gap }}
            {...restProps}
        >
            {p.children}
        </div>
    );
}
