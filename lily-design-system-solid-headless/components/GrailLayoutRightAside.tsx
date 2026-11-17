// GrailLayoutRightAside component
//
// A headless container for the right aside section of a GrailLayout. It
// typically contains supplementary content, ads, related links, or contextual
// information.
//
// Props:
//   class — string, optional. CSS class name.
//   children — ReactNode, required. Content to render inside the right aside.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <GrailLayoutRightAside>{children}</GrailLayoutRightAside>
//
// Examples:
//   <GrailLayoutRightAside><aside>Supplementary content</aside></GrailLayoutRightAside>
//
// Keyboard:
//   - None. Structural layout component with no interactive behavior.
//
// Accessibility:
//   - No explicit ARIA attributes; consumers use semantic landmarks within sections
//
// Internationalization:
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling

import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export interface GrailLayoutRightAsideProps {
    class?: string;
    /** Content to render inside the right aside. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function GrailLayoutRightAside(props: GrailLayoutRightAsideProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(p, "class", "children");
    return (
        <aside
            class={`grail-layout-right-aside ${p.class}`}
            {...restProps}
        >
            {p.children}
        </aside>
    );
}
