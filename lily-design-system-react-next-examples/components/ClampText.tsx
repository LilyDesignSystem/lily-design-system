// ClampText component
//
// A headless text container that truncates content to a maximum number of
// visible lines. The full content remains in the DOM and accessible to screen
// readers; the visual line clamp is implemented by consumer CSS reading the
// data-lines attribute or the inline --clamp-text-lines custom property.
//
// Props:
//   className — string, optional. CSS class name.
//   lines     — number, default 2. Maximum number of visible lines.
//   label     — string, optional. aria-label for screen readers.
//   children  — ReactNode, required. The text content to clamp.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <ClampText lines={3}>Long text content...</ClampText>
//
// Examples:
//
//   <ClampText lines={2}>
//     A long description that should be truncated to two visible lines.
//   </ClampText>
//
//
//   <ClampText lines={4} label="Product description">
//     Detailed product description text...
//   </ClampText>
//
// Keyboard: None — passive content container.
//
// Accessibility:
//   - Full text content remains in the DOM (not visually hidden)
//   - Optional aria-label override via label prop
//   - data-lines attribute exposed for consumer CSS
//
// Internationalization:
//   - All text supplied by consumer via children
//   - Optional label prop allows localized aria-label
//
// Claude rules:
//   - Headless: no CSS, no overflow rules — consumer applies line-clamp
//   - Inline style only sets --clamp-text-lines custom property
//
// References:
//   - CSS line-clamp: https://developer.mozilla.org/en-US/docs/Web/CSS/line-clamp

import React from "react";

export interface ClampTextProps {
    className?: string;
    /** Maximum number of visible lines */
    lines?: number;
    /** Accessible label for screen readers */
    label?: string;
    /** Content to clamp */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function ClampText({
    className = "",
    lines = 2,
    label = undefined,
    children,
    ...restProps
}: ClampTextProps) {
    return (
        <div
        className={`clamp-text ${className}`}
        data-lines={lines}
        style={{ "--clamp-text-lines": lines } as React.CSSProperties}
        aria-label={label}
        {...restProps}
        >
        {children}
        </div>
    );
}
