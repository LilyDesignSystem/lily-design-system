// FeaturePhoto component
//
// A responsive feature photo with required alt text and optional caption /
// credit. Renders a <figure> containing an <img> plus a <figcaption> when
// caption or credit is supplied. Defaults to lazy loading; consumers can
// override to "eager" for above-the-fold hero images. Width/height are
// passed through to the <img> so browsers can reserve the slot and avoid
// CLS.
//
// Props:
//   className — string, optional. CSS class name.
//   src      — string, required. Image source URL.
//   alt      — string, required. Alt text describing the image.
//   caption  — ReactNode, optional. Caption rendered inside <figcaption>.
//   credit   — ReactNode, optional. Photographer / source credit.
//   loading  — "lazy" | "eager", default "lazy".
//   width    — number, optional. Intrinsic image width for aspect ratio.
//   height   — number, optional. Intrinsic image height for aspect ratio.
//   ...restProps — additional HTML attributes spread onto the <figure>.
//
// Accessibility:
//   - alt is required; if the photo is purely decorative, pass alt=""
//   - caption + credit live inside a single <figcaption>
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling

import React from "react";

export interface FeaturePhotoProps {
    className?: string;
    /** Image source URL. */
    src: string;
    /** Alt text describing the image (use "" for decorative photos). */
    alt: string;
    /** Caption rendered inside <figcaption>. */
    caption?: React.ReactNode;
    /** Photographer / source credit. */
    credit?: React.ReactNode;
    /** Image loading strategy. */
    loading?: "lazy" | "eager";
    /** Intrinsic image width. */
    width?: number;
    /** Intrinsic image height. */
    height?: number;
    [key: string]: unknown;
}

export default function FeaturePhoto({
    className = "",
    src,
    alt,
    caption = undefined,
    credit = undefined,
    loading = "lazy",
    width,
    height,
    ...restProps
}: FeaturePhotoProps) {
    const hasCaption = caption !== undefined || credit !== undefined;
    return (
        <figure
            className={`feature-photo ${className}`}
            {...restProps}
        >
            <img
                className="feature-photo-image"
                src={src}
                alt={alt}
                loading={loading}
                width={width}
                height={height}
            />
            {hasCaption && (
                <figcaption className="feature-photo-caption">
                    {caption !== undefined && (
                        <span className="feature-photo-caption-text">{caption}</span>
                    )}
                    {credit !== undefined && (
                        <span className="feature-photo-credit">{credit}</span>
                    )}
                </figcaption>
            )}
        </figure>
    );
}
