// ContainerWithFixedWidth component
//
// A headless centered content wrapper that constrains its children to a
// fixed maximum width. Centers itself horizontally within its parent using
// margin-inline: auto. The maximum width is applied via inline style and
// also exposed via a data-max-width attribute for consumer CSS hooks.
//
// Props:
//   class — string, optional. CSS class name.
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

import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
import { attr } from "./attr";
export interface ContainerWithFixedWidthProps {
    class?: string;
    /** Max width CSS value, e.g. "1200px", "64rem" */
    maxWidth?: string;
    /** Content to display inside the container */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function ContainerWithFixedWidth(props: ContainerWithFixedWidthProps) {
    const p = withDefaults({ class: "" as const, maxWidth: "1200px" as const }, props);
    const restProps = omit(p, "class", "maxWidth", "children");
    return (
        <div
            class={`container-with-fixed-width ${p.class}`}
            style={{ "max-width": p.maxWidth, "margin-inline": "auto" }}
            data-max-width={attr(p.maxWidth)}
            {...restProps}
        >
            {p.children}
        </div>
    );
}
