// GrailLayout component
//
// A headless container that provides the classic "holy grail" web design structure
// with five sections: a full-width top header, a left sidebar, a center content
// area, a right sidebar, and a full-width bottom footer. Renders a <div> with no
// layout styles, allowing consumers to apply CSS Grid, Flexbox, or any layout system.
//
// Props:
//   class — string, optional. CSS class name.
//   children — ReactNode, required. Layout section elements to render.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <GrailLayout>{children}</GrailLayout>
//
// Examples:
//
//   <GrailLayout>
//     <GrailLayoutTop>Header</GrailLayoutTop>
//     <GrailLayoutLeft>Left sidebar</GrailLayoutLeft>
//     <GrailLayoutCenter>Main content</GrailLayoutCenter>
//     <GrailLayoutRight>Right sidebar</GrailLayoutRight>
//     <GrailLayoutBottom>Footer</GrailLayoutBottom>
//   </GrailLayout>
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
//   - No layout styles applied; consumer provides CSS Grid or Flexbox
//
// References:
//   - CSS Grid Layout: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface GrailLayoutProps {
    class?: string;
    /** Layout section elements. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function GrailLayout(props: GrailLayoutProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "children");
    return (
        <div
            class={`grail-layout ${p.class}`}
            {...restProps}
        >
            {p.children}
        </div>
    );
}
