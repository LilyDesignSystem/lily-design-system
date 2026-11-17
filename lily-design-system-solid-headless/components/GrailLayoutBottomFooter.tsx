// GrailLayoutBottomFooter component
//
// A headless container for the bottom footer section of a GrailLayout. It spans
// the full width of the layout and typically contains copyright, links, or
// site-wide footer content.
//
// Props:
//   class — string, optional. CSS class name.
//   children — ReactNode, required. Content to render inside the bottom footer section.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <GrailLayoutBottomFooter>{children}</GrailLayoutBottomFooter>
//
// Examples:
//   <GrailLayoutBottomFooter><footer>Site Footer</footer></GrailLayoutBottomFooter>
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
export interface GrailLayoutBottomFooterProps {
    class?: string;
    /** Content to render inside the bottom footer section. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function GrailLayoutBottomFooter(props: GrailLayoutBottomFooterProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(p, "class", "children");
    return (
        <footer
            class={`grail-layout-bottom-footer ${p.class}`}
            {...restProps}
        >
            {p.children}
        </footer>
    );
}
