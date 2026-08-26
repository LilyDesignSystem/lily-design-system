// ImageInput component
//
// A headless image submit button using the native HTML <input type="image">
// element. It renders a clickable image that, when activated within a form,
// triggers the form's submit event — functioning like a graphical submit
// button. The component requires src and alt attributes for proper rendering
// and accessibility. Optional width and height attributes control dimensions.
//
// Props:
//   className — string, optional. CSS class name.
//   src — string, required. URL of the image to display.
//   alt — string, required. Alternative text describing the image button.
//   width — number, optional. Width of the image in pixels.
//   height — number, optional. Height of the image in pixels.
//   disabled — boolean, default false. Whether the button is disabled.
//   ...restProps — additional HTML attributes spread onto the <input>.
//
// Syntax:
//   <ImageInput src="/submit.png" alt="Submit" />
//
// Examples:
//
//   <ImageInput src="/submit.png" alt="Submit" />
//
//
//   <ImageInput src="/send.png" alt="Send form" width={100} height={40} />
//
//
//   <ImageInput src="/save.png" alt="Save changes" disabled={!formValid} />
//
// Keyboard:
//   - Enter: activates the image button (native behavior)
//   - Space: activates the image button (native behavior)
//
// Accessibility:
//   - The alt attribute provides the accessible name for the image button
//   - Native <input type="image"> has an implicit button role
//   - No additional ARIA attributes needed beyond native semantics
//
// Internationalization:
//   - The alt prop externalizes the accessible name for localization
//   - Consumers should provide translated alt text for other locales
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - No children prop -- uses alt attribute for accessible name
//
// References:
//   - MDN input type="image": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/image

import React from "react";

export interface ImageInputProps {
    className?: string;
    /** URL of the image. */
    src: string;
    /** Alternative text for the image. */
    alt: string;
    /** Width of the image in pixels. */
    width?: number;
    /** Height of the image in pixels. */
    height?: number;
    /** Whether disabled. */
    disabled?: boolean;
    [key: string]: unknown;
}

export default function ImageInput({
    className = "",
    src,
    alt,
    width,
    height,
    disabled = false,
    ...restProps
}: ImageInputProps) {
    return (
        <input
        className={`image-input ${className}`}
        type="image"
        src={src}
        alt={alt}
        width={width}
        height={height}
        disabled={disabled}
        {...restProps}
        />
    );
}
