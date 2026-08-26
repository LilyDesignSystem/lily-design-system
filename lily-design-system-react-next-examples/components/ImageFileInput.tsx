// ImageFileInput component
//
// An image file input that provides a file upload control pre-configured to accept
// image files. Wraps a native <input type="file"> element with accessible labeling
// and sensible defaults for image selection. Useful for profile photo uploads, gallery
// image selection, document scanning, and any form requiring image file input.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name applied via aria-label.
//   accept — string, default "image/*". MIME type filter for the file picker dialog.
//   required — boolean, default false. Whether the input is required for form submission.
//   disabled — boolean, default false. Whether the input is disabled.
//   ...restProps — additional HTML attributes spread onto the input element.
//
// Syntax:
//   <ImageFileInput label="Upload profile photo" />
//
// Examples:
//
//   <ImageFileInput label="Upload profile photo" />
//
//
//   <ImageFileInput label="Upload document scan" accept="image/png, image/jpeg" required />
//
// Keyboard:
//   - Tab: Focus the file input
//   - Enter / Space: Open the file picker dialog (native browser behavior)
//
// Accessibility:
//   - aria-label provides an accessible name for the file input
//   - Uses native <input type="file"> which provides built-in keyboard and screen reader support
//
// Internationalization:
//   - The label prop allows localized accessible names; no hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Uses native <input type="file"> element with accept="image/*" default
//   - Consumer can narrow accepted types via the accept prop
//
// References:
//   - MDN Input type="file": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file

import React from "react";

export interface ImageFileInputProps {
    className?: string;
    label: string;
    accept?: string;
    required?: boolean;
    disabled?: boolean;
    [key: string]: unknown;
}

export default function ImageFileInput({
    className = "",
    label,
    accept = "image/*",
    required = false,
    disabled = false,
    ...restProps
}: ImageFileInputProps) {
    return (
        <input
            className={`image-file-input ${className}`}
            type="file"
            aria-label={label}
            accept={accept}
            required={required}
            disabled={disabled}
            {...restProps}
        />
    );
}
