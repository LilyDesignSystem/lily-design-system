// FileUpload component
//
// A button-triggered file picker for uploading files. Combines a hidden
// <input type="file"> with a visible button and a live status region that
// announces how many files have been selected. Useful for document uploads,
// image uploads, and any form that accepts file attachments.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name for the upload button; also displayed as button text.
//   accept — string, default undefined. Accepted file types (e.g., ".pdf", "image/*").
//   multiple — boolean, default false. Whether to allow selecting multiple files.
//   disabled — boolean, default false. Whether the button is disabled.
//   onInputChange — (files: FileList | null) => void, default undefined. Callback when files are selected.
//   ...restProps — additional HTML attributes spread onto the outer <div>.
//
// Syntax:
//   <FileUpload label="Upload files" accept=".pdf" onInputChange={handleFiles} />
//
// Examples:
//
//   <FileUpload label="Upload files" accept=".pdf" onInputChange={handleFiles} />
//
//
//   <FileUpload label="Upload images" accept="image/*" multiple onInputChange={handleImages} />
//
// Keyboard:
//   - Tab: focus the upload button
//   - Enter/Space: activate the file picker dialog (native button behavior)
//
// Accessibility:
//   - aria-label on the button provides the accessible name
//   - aria-live="polite" on the status span announces file count changes
//   - data-file-count attribute for consumer CSS or testing
//   - Hidden file input is triggered via button click
//
// Internationalization:
//   - The label prop accepts any string; consumers provide localized text
//   - Status text "file"/"files" is hardcoded; override via consumer if needed
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Uses type="button" on trigger to prevent form submission
//   - Tracks file count via useState() for the live status region
//
// References:
//   - MDN input type="file": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file

import React, { useRef, useState } from "react";

export interface FileUploadProps {
    className?: string;
    /** Accessible label for the button. */
    label: string;
    /** Accepted file types. */
    accept?: string;
    /** Allow multiple files. */
    multiple?: boolean;
    /** Whether disabled. */
    disabled?: boolean;
    /** Callback with selected files. */
    onInputChange?: (files: FileList | null) => void;
    [key: string]: unknown;
}

export default function FileUpload({
    className = "",
    label,
    accept = undefined,
    multiple = false,
    disabled = false,
    onInputChange = undefined,
    ...restProps
}: FileUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [fileCount, setFileCount] = useState(0);

    function handleClick() {
        inputRef.current?.click();
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const input = event.target;
        setFileCount(input.files?.length ?? 0);
        onInputChange?.(input.files);
    }

    return (
        <div
            className={`file-upload ${className}`}
            {...restProps}
        >
            <button
                type="button"
                aria-label={label}
                disabled={disabled}
                onClick={handleClick}
            >
                {label}
            </button>
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                multiple={multiple}
                hidden
                onChange={handleChange}
            />
            <span
                aria-live="polite"
                data-file-count={fileCount}
            >
                {fileCount > 0 && (
                    <>{fileCount} {fileCount === 1 ? "file" : "files"} selected</>
                )}
            </span>
        </div>
    );
}
