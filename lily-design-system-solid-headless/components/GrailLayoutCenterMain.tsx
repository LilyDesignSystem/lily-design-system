// GrailLayoutCenterMain component
//
// A headless container for the center main content section of a GrailLayout. It
// holds the primary page content and is flanked by the left and right sidebars.
//
// Props:
//   class — string, optional. CSS class name.
//   children — ReactNode, required. Content to render inside the center main section.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <GrailLayoutCenterMain>{children}</GrailLayoutCenterMain>
//
// Examples:
//   <GrailLayoutCenterMain><main>Primary content</main></GrailLayoutCenterMain>
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
export interface GrailLayoutCenterMainProps {
    class?: string;
    /** Content to render inside the center main content section. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function GrailLayoutCenterMain(props: GrailLayoutCenterMainProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "children");
    return (
        <main
            class={`grail-layout-center-main ${p.class}`}
            {...restProps}
        >
            {p.children}
        </main>
    );
}
