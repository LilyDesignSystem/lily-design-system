// ImageCropper component
//
// A headless container for cropping and resizing an image to a selected region.
// Renders a <div> with role="application" and an accessible label. Commonly used
// in avatar editors, media upload flows, and document scanning workflows. The
// consumer provides the actual cropping implementation (HTML canvas, SVG overlay,
// or a third-party cropping library).
//
// Props:
//   className — string, optional. CSS class name.
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

import React from "react";

export interface ImageCropperProps {
    className?: string;
    /** Accessible label. */
    label: string;
    /** Cropping surface content. */
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function ImageCropper({
    className = "",
    label,
    children,
    ...restProps
}: ImageCropperProps) {
    return (
        <div
        className={`image-cropper ${className}`}
        role="application"
        aria-label={label}
        {...restProps}
        >
        {children}
        </div>
    );
}
