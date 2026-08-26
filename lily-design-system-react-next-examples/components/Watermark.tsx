// Watermark component
//
// A decorative repeating overlay text or image marking a page. The headless
// component exposes the configuration as `data-*` attributes on a sibling
// overlay element with `aria-hidden="true"`. The consumer is responsible
// for the actual repeating-pattern CSS (e.g. background-image with
// SVG-encoded text) — this component only provides the structure and ARIA.
//
// Props:
//   className    — string, optional. CSS class name.
//   text         — string, optional. Watermark text.
//   imageUrl     — string, optional. Watermark image URL (alternative to text).
//   gap          — string, default "100px". Spacing between repeats.
//   rotate       — number (deg), default -22. Rotation angle.
//   children     — ReactNode, optional. Content beneath the watermark.
//   ...restProps — additional HTML attributes spread onto the root <div>.
//
// Syntax:
//   <Watermark text="Confidential" rotate={-22} gap="120px">
//     <article>…</article>
//   </Watermark>
//
// Accessibility:
//   - The overlay is `aria-hidden="true"` (decorative only)
//
// Internationalization:
//   - text is consumer-supplied
//
// Claude rules:
//   - Headless: no CSS, no styles
//   - Inline `style` only for documented behavior (none required by default;
//     the spec uses data-* hooks). The structure is the headless contract.
//
// References:
//   - Ant Design Watermark: https://ant.design/components/watermark

import React from "react";

export interface WatermarkProps {
    className?: string;
    /** Watermark text */
    text?: string;
    /** Watermark image URL (alternative to text) */
    imageUrl?: string;
    /** Spacing between repeats (CSS length) */
    gap?: string;
    /** Rotation angle in degrees */
    rotate?: number;
    /** Content beneath the watermark */
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function Watermark({
    className = "",
    text = undefined,
    imageUrl = undefined,
    gap = "100px",
    rotate = -22,
    children = undefined,
    ...restProps
}: WatermarkProps) {
    return (
        <div
            className={`watermark ${className}`}
            data-rotate={rotate}
            data-gap={gap}
            {...restProps}
        >
            <div
                className="watermark-overlay"
                aria-hidden="true"
                data-text={text}
                data-image-url={imageUrl}
            />
            {children}
        </div>
    );
}
