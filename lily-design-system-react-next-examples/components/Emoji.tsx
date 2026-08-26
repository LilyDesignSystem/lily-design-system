// Emoji component
//
// Wraps an emoji character with proper accessibility semantics so that screen
// readers announce a meaningful description instead of the raw Unicode character.
// Renders a <span> with role="img" and a required aria-label. Use for any emoji
// that conveys meaning; decorative emoji should be hidden from assistive technology.
//
// Props:
//   className — string, optional. CSS class name.
//   emoji — string, required. The emoji character(s) to display.
//   label — string, required. Accessible name describing the emoji for screen readers.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <Emoji emoji="👍" label="Thumbs up" />
//
// Examples:
//   
//   <Emoji emoji="👍" label="Thumbs up" />
//
//   
//   <Emoji emoji="⚠️" label="Warning" />
//
// Keyboard:
//   - None — passive inline display element
//
// Accessibility:
//   - role="img" identifies the emoji as an image for assistive technologies
//   - aria-label provides a textual description of the emoji character
//
// Internationalization:
//   - The label prop accepts any string; consumers provide localized descriptions
//   - Emoji characters are locale-independent
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Always require a label for meaningful emoji
//
// References:
//   - WAI-ARIA img role: https://www.w3.org/TR/wai-aria-1.2/#img

import React from "react";

export interface EmojiProps {
    className?: string;
    /** The emoji character(s). */
    emoji: string;
    /** Accessible name for the emoji. */
    label: string;
    [key: string]: unknown;
}

export default function Emoji({
    className = "",
    emoji,
    label,
    ...restProps
}: EmojiProps) {
    return (
        <span
        className={`emoji ${className}`}
        role="img"
        aria-label={label}
        {...restProps}>{emoji}</span
        >
    );
}
