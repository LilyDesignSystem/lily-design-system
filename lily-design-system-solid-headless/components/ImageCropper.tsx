// ImageCropper component
//
// A headless container for cropping and resizing an image to a selected region.
// Renders a <div> with role="application" and an accessible label. Commonly used
// in avatar editors, media upload flows, and document scanning workflows. The
// consumer provides the actual cropping implementation (HTML canvas, SVG overlay,
// or a third-party cropping library).
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, required. Accessible description of the cropping region via aria-label.
//   children — ReactNode, required. Cropping surface (canvas, image with overlay, or other mechanism).
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <ImageCropper label="Crop image">
//     <canvas width="400" height="400"></canvas>
//   </ImageCropper>
//
// Examples:
//
//   <ImageCropper label="Crop your avatar">
//     <canvas width="400" height="400"></canvas>
//   </ImageCropper>
//
//
//   <ImageCropper label="Select crop region">
//     <img src="photo.jpg" alt="Uploaded photo" />
//   </ImageCropper>
//
// Keyboard:
//   - None — pointer-based interactions are handled by the consumer-provided cropping surface.
//
// Accessibility:
//   - role="application" indicates a complex widget with custom pointer interactions
//   - aria-label provides an accessible description of the image cropper purpose
//   - Assistive technologies pass keyboard events through to the application
//
// Internationalization:
//   - The label prop externalizes the accessible description for localization
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - No internal cropping logic — consumer provides canvas/image/overlay implementation
//   - role="application" is intentional for complex pointer interaction widgets
//
// References:
//   - WAI-ARIA application role: https://www.w3.org/TR/wai-aria-1.2/#application

import type { JSX } from "@solidjs/web";
import { merge, omit, onSettled, untrack } from "solid-js";
import { attachCropper, type CropRect } from "./widget-keys";

export interface ImageCropperProps {
    /** Where the rectangle starts, in percent. Default: the whole image. */
    crop?: CropRect;
    /** Called with each new rectangle. */
    onCropChange?: (crop: CropRect) => void;
    class?: string;
    /** Accessible label. */
    label: string;
    /** Cropping surface content. */
    children?: JSX.Element;
    [key: string]: unknown;
}

export default function ImageCropper(props: ImageCropperProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "crop", "onCropChange", "children");
    const rootRef: { current: HTMLDivElement | null } = { current: null };
    // The latest props, read live: a Solid component body runs once.
    const latest = {
        get current() {
            return p.onCropChange;
        },
    };
    const start = { current: p.crop };
    onSettled(() =>
        untrack(() =>
            attachCropper(rootRef.current!, {
                crop: start.current,
                onChange: (next) => latest.current?.(next),
            }),
        ),
    );

    return (
        <div
            ref={(el) => (rootRef.current = el)}
            class={`image-cropper ${p.class}`}
            role="application"
            aria-label={p.label}
            {...restProps}
        >
            {p.children}
        </div>
    );
}
