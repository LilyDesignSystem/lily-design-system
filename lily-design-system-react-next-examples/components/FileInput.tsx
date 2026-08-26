// FileInput component
//
// A file input wrapping a native <input type="file"> with accessible labeling.
// Allows users to select one or more files from their device for upload. Supports
// filtering by accepted file types, multiple file selection, and standard form
// states. Used in upload forms, profile editors, and document management interfaces.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name via aria-label.
//   accept — string, default undefined. Comma-separated accepted file types (MIME types or extensions).
//   multiple — boolean, default false. Whether multiple files can be selected.
//   required — boolean, default false. Whether a file selection is required.
//   disabled — boolean, default false. Whether the file input is disabled.
//   ...restProps — additional HTML attributes spread onto the <input>.
//
// Syntax:
//   <FileInput label="Upload photo" accept="image/*" />
//
// Examples:
//
//   <FileInput label="Upload photo" accept="image/*" />
//
//
//   <FileInput label="Attach documents" accept=".pdf,.doc,.docx" multiple />
//
//
//   <FileInput label="Profile picture" accept="image/png,image/jpeg" required />
//
// Keyboard:
//   - Enter/Space: opens the file picker dialog (native browser behavior)
//
// Accessibility:
//   - aria-label provides the accessible name since no visible <label> is included
//
// Internationalization:
//   - The label prop accepts any string; consumers provide localized text
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - No bindable value; file inputs are read-only by security policy
//
// References:
//   - MDN input type="file": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file

import React from "react";

export interface FileInputProps {
    className?: string;
    /** Accessible label. */
    label: string;
    /** Accepted file types. */
    accept?: string;
    /** Allow multiple files. */
    multiple?: boolean;
    /** Whether required. */
    required?: boolean;
    /** Whether disabled. */
    disabled?: boolean;
    [key: string]: unknown;
}

export default function FileInput({
    className = "",
    label,
    accept = undefined,
    multiple = false,
    required = false,
    disabled = false,
    ...restProps
}: FileInputProps) {
    return (
        <input
            className={`file-input ${className}`}
            type="file"
            aria-label={label}
            accept={accept}
            multiple={multiple}
            required={required}
            disabled={disabled}
            {...restProps}
        />
    );
}
