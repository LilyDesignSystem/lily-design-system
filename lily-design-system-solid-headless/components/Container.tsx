// Container component
//
// A generic block-level content container. Renders a <div> with the `container` hook and no ARIA; use
// ContainerWithFixedWidth or ContainerWithFluidWidth when a width behaviour is wanted.
//
// Props:
//   class — string, optional. CSS class name.
//   children — JSX.Element, optional. The content.
//   ...restProps — additional HTML attributes spread onto the root <div>.
//
// Syntax:
//   <Container>…</Container>
//
// Examples:
//   <Container><p>Content</p></Container>
//
// Keyboard:
//   - None -- not interactive; any interactive children handle their own keys
//
// Accessibility:
//   - No role or ARIA: a generic wrapper
//
// Internationalization:
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//
// References:
//   - MDN <div>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface ContainerProps {
    class?: string;
    children?: JSX.Element;
    [key: string]: unknown;
}

export default function Container(props: ContainerProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "children");
    return (
        <div
            class={`container ${p.class}`}
            {...restProps}
        >
            {p.children}
        </div>
    );
}
