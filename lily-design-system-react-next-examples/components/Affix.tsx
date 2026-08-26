// Affix component
//
// A wrapper that pins its content to a viewport position while the page
// scrolls. Uses CSS `position: sticky` as the headless behavior. Either
// `offsetTop` or `offsetBottom` can be supplied (defaults to top: 0 if
// neither is given). The values are also exposed as `data-offset-top` and
// `data-offset-bottom` for consumer CSS hooks.
//
// Props:
//   className     — string, optional. CSS class name.
//   offsetTop     — number (px), optional. Distance from top edge when affixed.
//   offsetBottom  — number (px), optional. Distance from bottom edge when affixed.
//   children      — ReactNode, required. The pinned content.
//   ...restProps  — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <Affix offsetTop={16}>
//     <nav>…</nav>
//   </Affix>
//
// Examples:
//
//   <Affix offsetTop={0}>
//     <header>Sticky header</header>
//   </Affix>
//
//   <Affix offsetBottom={16}>
//     <button>Back to top</button>
//   </Affix>
//
// Accessibility:
//   - Purely structural; does not add ARIA semantics.
//
// Internationalization:
//   - No user-facing strings.
//
// Claude rules:
//   - Headless: no CSS classes beyond the base + consumer className.
//   - Inline `style` only for documented behavior (position: sticky).
//
// References:
//   - Ant Design Affix: https://ant.design/components/affix
//   - MDN position: sticky: https://developer.mozilla.org/en-US/docs/Web/CSS/position#sticky_positioning

import React from "react";

export interface AffixProps {
    className?: string;
    /** Distance from top edge when affixed (px) */
    offsetTop?: number;
    /** Distance from bottom edge when affixed (px) */
    offsetBottom?: number;
    /** The pinned content */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function Affix({
    className = "",
    offsetTop = undefined,
    offsetBottom = undefined,
    children,
    ...restProps
}: AffixProps) {
    const hasTop: boolean = typeof offsetTop === "number";
    const hasBottom: boolean = typeof offsetBottom === "number";
    const style: React.CSSProperties = { position: "sticky" };
    if (hasTop) {
        style.top = `${offsetTop}px`;
    } else if (hasBottom) {
        style.bottom = `${offsetBottom}px`;
    } else {
        style.top = "0";
    }
    return (
        <div
            className={`affix ${className}`}
            style={style}
            data-offset-top={hasTop ? offsetTop : undefined}
            data-offset-bottom={hasBottom ? offsetBottom : undefined}
            {...restProps}
        >
            {children}
        </div>
    );
}
