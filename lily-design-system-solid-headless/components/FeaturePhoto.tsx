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
//   class — string, optional. CSS class name.
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

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface FeaturePhotoProps {
    class?: string;
    /** Image source URL. */
    src: string;
    /** Alt text describing the image (use "" for decorative photos). */
    alt: string;
    /** Caption rendered inside <figcaption>. */
    caption?: JSX.Element;
    /** Photographer / source credit. */
    credit?: JSX.Element;
    /** Image loading strategy. */
    loading?: "lazy" | "eager";
    /** Intrinsic image width. */
    width?: number;
    /** Intrinsic image height. */
    height?: number;
    [key: string]: unknown;
}

export default function FeaturePhoto(props: FeaturePhotoProps) {
    const p = merge({ class: "" as const, loading: "lazy" as const }, props);
    const restProps = omit(
        p,
        "class",
        "src",
        "alt",
        "caption",
        "credit",
        "loading",
        "width",
        "height",
    );
    const hasCaption = () => p.caption !== undefined || p.credit !== undefined;
    return (
        <figure
            class={`feature-photo ${p.class}`}
            {...restProps}
        >
            <img
                class="feature-photo-image"
                src={p.src}
                alt={p.alt}
                loading={p.loading}
                width={p.width}
                height={p.height}
            />
            {hasCaption() && (
                <figcaption class="feature-photo-caption">
                    {p.caption !== undefined && (
                        <span class="feature-photo-caption-text">{p.caption}</span>
                    )}
                    {p.credit !== undefined && <span class="feature-photo-credit">{p.credit}</span>}
                </figcaption>
            )}
        </figure>
    );
}
