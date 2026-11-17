// ContainerWithFluidWidth component
//
// A headless full-width content wrapper that fills its parent's inline size
// and applies a configurable horizontal padding. The padding value is set
// inline and also exposed via a data-padding-inline attribute for consumer
// CSS hooks.
//
// Props:
//   class     — string, optional. CSS class name.
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

import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
import { attr } from "./attr";
export interface ContainerWithFluidWidthProps {
    class?: string;
    /** Horizontal padding CSS value */
    paddingInline?: string;
    /** Content to display inside the container */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function ContainerWithFluidWidth(props: ContainerWithFluidWidthProps) {
    const p = withDefaults({ class: "" as const, paddingInline: "1rem" as const }, props);
    const restProps = omit(p, "class", "paddingInline", "children");
    return (
        <div
            class={`container-with-fluid-width ${p.class}`}
            style={{ width: "100%", "padding-inline": p.paddingInline }}
            data-padding-inline={attr(p.paddingInline)}
            {...restProps}
        >
            {p.children}
        </div>
    );
}
