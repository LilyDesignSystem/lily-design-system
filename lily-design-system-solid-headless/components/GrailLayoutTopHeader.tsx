// GrailLayoutTopHeader component
//
// A headless container for the top header section of a GrailLayout. It spans
// the full width of the layout and typically contains site branding, navigation,
// or a top bar.
//
// Props:
//   class — string, optional. CSS class name.
//   children — ReactNode, required. Content to render inside the top header section.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <GrailLayoutTopHeader>{children}</GrailLayoutTopHeader>
//
// Examples:
//   <GrailLayoutTopHeader><header>Site Header</header></GrailLayoutTopHeader>
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
export interface GrailLayoutTopHeaderProps {
    class?: string;
    /** Content to render inside the top header section. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function GrailLayoutTopHeader(props: GrailLayoutTopHeaderProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "children");
    return (
        <header
            class={`grail-layout-top-header ${p.class}`}
            {...restProps}
        >
            {p.children}
        </header>
    );
}
