// AvatarText component
//
// The text/initials fallback within an Avatar. Renders a <span>
// with aria-hidden="true" containing the initials or short text that
// represents the user when no image is available. Must be used inside
// an Avatar container.
//
// Props:
//   className — string, optional. CSS class name.
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

import React from "react";

export interface AvatarTextProps {
    className?: string;
    /** Initials or short text. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function AvatarText({
    className = "",
    children,
    ...restProps
}: AvatarTextProps) {
    return (
        <span
        className={`avatar-text ${className}`}
        aria-hidden="true"
        {...restProps}
        >
        {children}
        </span>
    );
}
