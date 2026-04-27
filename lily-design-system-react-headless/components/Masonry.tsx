// Masonry component
//
// A headless masonry-style layout container that arranges children into a
// configurable number of columns using the CSS columns model. Children with
// variable heights flow into columns automatically. Consumer CSS should set
// `break-inside: avoid` on direct children to keep items from splitting
// across columns.
//
// Props:
//   className — string, optional. CSS class name.
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
//     {photos.map(p => <img key={p.id} src={p.url} alt={p.alt} />)}
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

import React from "react";

export interface MasonryProps {
    className?: string;
    /** Number of columns */
    columns?: number;
    /** Gap between columns (CSS value) */
    gap?: string;
    /** Items to lay out */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function Masonry({
    className = "",
    columns = 3,
    gap = "1rem",
    children,
    ...restProps
}: MasonryProps) {
    return (
        <div
        className={`masonry ${className}`}
        data-columns={columns}
        style={{ columnCount: columns, columnGap: gap }}
        {...restProps}
        >
        {children}
        </div>
    );
}
