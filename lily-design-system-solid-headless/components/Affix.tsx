// Affix component
//
// A wrapper that pins its content to a viewport position while the page
// scrolls. Uses CSS `position: sticky` as the headless behavior. Either
// `offsetTop` or `offsetBottom` can be supplied (defaults to top: 0 if
// neither is given). The values are also exposed as `data-offset-top` and
// `data-offset-bottom` for consumer CSS hooks.
//
// Props:
//   class     — string, optional. CSS class name.
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
//   - Headless: no CSS classes beyond the base + consumer class.
//   - Inline `style` only for documented behavior (position: sticky).
//
// References:
//   - Ant Design Affix: https://ant.design/components/affix
//   - MDN position: sticky: https://developer.mozilla.org/en-US/docs/Web/CSS/position#sticky_positioning

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
import { attr } from "./attr";
export interface AffixProps {
    class?: string;
    /** Distance from top edge when affixed (px) */
    offsetTop?: number;
    /** Distance from bottom edge when affixed (px) */
    offsetBottom?: number;
    /** The pinned content */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function Affix(props: AffixProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "offsetTop", "offsetBottom", "children");
    const hasTop = (): boolean => typeof p.offsetTop === "number";
    const hasBottom = (): boolean => typeof p.offsetBottom === "number";
    const style = (): JSX.CSSProperties =>
        hasTop()
            ? { position: "sticky", top: `${p.offsetTop}px` }
            : hasBottom()
              ? { position: "sticky", bottom: `${p.offsetBottom}px` }
              : { position: "sticky", top: "0" };
    return (
        <div
            class={`affix ${p.class}`}
            style={style()}
            data-offset-top={attr(hasTop() ? p.offsetTop : undefined)}
            data-offset-bottom={attr(hasBottom() ? p.offsetBottom : undefined)}
            {...restProps}
        >
            {p.children}
        </div>
    );
}
