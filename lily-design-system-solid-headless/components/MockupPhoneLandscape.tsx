// MockupPhoneLandscape component
//
// A device frame that looks like a mobile phone in landscape orientation. Renders a <div role="img">
// with the `mockup-phone-landscape` hook, named by a required label.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, required. The text alternative, rendered as aria-label.
//   children — JSX.Element, optional. The framed content.
//   ...restProps — additional HTML attributes spread onto the root <div>.
//
// Syntax:
//   <MockupPhoneLandscape label="…">…</MockupPhoneLandscape>
//
// Examples:
//   <MockupPhoneLandscape label="The dashboard on a phone"><img src="screen.png" alt="" /></MockupPhoneLandscape>
//
// Keyboard:
//   - None -- not interactive; any interactive children handle their own keys
//
// Accessibility:
//   - role="img" makes the whole frame one image whose name is `label`; its descendants are presentational, so interactive content inside is not reachable by assistive technology
//
// Internationalization:
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - Use for pictures of a device, not for live interactive content
//
// References:
//   - WAI-ARIA img role: https://www.w3.org/TR/wai-aria-1.2/#img

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface MockupPhoneLandscapeProps {
    class?: string;
    label: string;
    children?: JSX.Element;
    [key: string]: unknown;
}

export default function MockupPhoneLandscape(props: MockupPhoneLandscapeProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "children");
    return (
        <div
            class={`mockup-phone-landscape ${p.class}`}
            role="img"
            aria-label={p.label}
            {...restProps}
        >
            {p.children}
        </div>
    );
}
