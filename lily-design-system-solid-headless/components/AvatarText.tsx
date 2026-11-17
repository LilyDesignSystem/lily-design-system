// AvatarText component
//
// The text/initials fallback within an Avatar. Renders a <span>
// with aria-hidden="true" containing the initials or short text that
// represents the user when no image is available. Must be used inside
// an Avatar container.
//
// Props:
//   class — string, optional. CSS class name.
//   children — ReactNode, required. Initials or short text (e.g., "JD").
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <AvatarText>JD</AvatarText>
//
// Examples:
//
//   <Avatar alt="Jane Doe">
//     <AvatarText>JD</AvatarText>
//   </Avatar>
//
//
//   <Avatar alt="Jane Doe">
//     <AvatarImage src="/photo.jpg" alt="Jane Doe" />
//     <AvatarText>JD</AvatarText>
//   </Avatar>
//
// Keyboard: None — display-only element.
//
// Accessibility:
//   - aria-hidden="true" prevents duplicate announcements since the
//     parent Avatar already has aria-label
//
// Internationalization:
//   - All text comes through the children prop
//   - No hardcoded strings
//
// Claude rules:
//   - Compound component — must be used inside an Avatar
//   - Headless: no CSS, no styles — consumer provides all styling
//
// References:
//   - WAI-ARIA img role: https://www.w3.org/TR/wai-aria-1.2/#img

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface AvatarTextProps {
    class?: string;
    /** Initials or short text. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function AvatarText(props: AvatarTextProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "children");
    return (
        <span
            class={`avatar-text ${p.class}`}
            aria-hidden="true"
            {...restProps}
        >
            {p.children}
        </span>
    );
}
