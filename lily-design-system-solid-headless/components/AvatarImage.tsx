// AvatarImage component
//
// The image element within an Avatar. Renders a native <img> element
// for displaying a user's profile photo. Must be used inside an Avatar
// container.
//
// Props:
//   class — string, optional. CSS class name.
//   src — string, required. URL of the avatar image.
//   alt — string, required. Accessible description for the image.
//   ...restProps — additional HTML attributes spread onto the <img>.
//
// Syntax:
//   <AvatarImage src="/photo.jpg" alt="Jane Doe" />
//
// Examples:
//
//   <Avatar alt="Jane Doe">
//     <AvatarImage src="/photos/jane.jpg" alt="Jane Doe" />
//   </Avatar>
//
// Keyboard: None — display-only element.
//
// Accessibility:
//   - Native <img> with alt text provides image accessibility
//   - aria-hidden="true" prevents duplicate announcements since the
//     parent Avatar already has aria-label
//
// Internationalization:
//   - alt text comes through props
//   - No hardcoded strings
//
// Claude rules:
//   - Compound component — must be used inside an Avatar
//   - Headless: no CSS, no styles — consumer provides all styling
//
// References:
//   - HTML img element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img

import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export interface AvatarImageProps {
    class?: string;
    /** URL of the avatar image. */
    src: string;
    /** Accessible description for the image. */
    alt: string;
    [key: string]: unknown;
}

export default function AvatarImage(props: AvatarImageProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(p, "class", "src", "alt");
    return (
        <img
            class={`avatar-image ${p.class}`}
            src={p.src}
            alt={p.alt}
            aria-hidden="true"
            {...restProps}
        />
    );
}
