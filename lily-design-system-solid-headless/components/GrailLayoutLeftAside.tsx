// GrailLayoutLeftAside component
//
// A headless container for the left aside section of a GrailLayout. It
// typically contains navigation menus, filters, or supplementary content.
//
// Props:
//   class — string, optional. CSS class name.
//   children — ReactNode, required. Content to render inside the left aside.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <GrailLayoutLeftAside>{children}</GrailLayoutLeftAside>
//
// Examples:
//   <GrailLayoutLeftAside><nav>Navigation menu</nav></GrailLayoutLeftAside>
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
import { merge, omit } from "solid-js";
export interface GrailLayoutLeftAsideProps {
    class?: string;
    /** Content to render inside the left aside. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function GrailLayoutLeftAside(props: GrailLayoutLeftAsideProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "children");
    return (
        <aside
            class={`grail-layout-left-aside ${p.class}`}
            {...restProps}
        >
            {p.children}
        </aside>
    );
}
