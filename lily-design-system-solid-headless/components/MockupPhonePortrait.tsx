// MockupPhonePortrait component
//
// A box area that looks like a mobile phone. Renders a decorative <div> container that
// the consumer styles to look like the named device or surface; useful in
// marketing pages, documentation, and component galleries to frame a
// screenshot or video preview.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, optional. Accessible name.
//   children — ReactNode, required. The content rendered inside the device frame.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Keyboard:
//   None — this is a passive decorative container.
//
// Accessibility:
//   - role="img", named by `label`: the mockup reads as one image.
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - No interactive behavior built in
//
// References:
//   - HTML div element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div

import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export interface MockupPhonePortraitProps {
    class?: string;
    /** Accessible name of the image of the device. */
    label?: string;
    /** Content rendered inside the device frame. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function MockupPhonePortrait(props: MockupPhonePortraitProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "children");
    return (
        <div
            class={`mockup-phone-portrait ${p.class}`}
            role="img"
            aria-label={p.label}
            {...restProps}
        >
            {p.children}
        </div>
    );
}
