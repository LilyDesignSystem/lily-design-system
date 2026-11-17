// FileUpload component
//
// A button-triggered file picker for uploading files. Combines a hidden
// <input type="file"> with a visible button and a live status region that
// announces how many files have been selected. Useful for document uploads,
// image uploads, and any form that accepts file attachments.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, required. Accessible name for the upload button; also displayed as button text.
//   accept — string, default undefined. Accepted file types (e.g., ".pdf", "image/*").
//   multiple — boolean, default false. Whether to allow selecting multiple files.
//   disabled — boolean, default false. Whether the button is disabled.
//   onInputChange — (files: FileList | null) => void, default undefined. Callback when files are selected.
//   selectedLabel — (count: number) => string, optional. The status for a count of files, in the consumer's words;
//     plural forms are the consumer's. Without it the status stays empty: no English default.
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

import { merge, omit, createSignal } from "solid-js";
import { attr } from "./attr";
import { useFormReset } from "./form-reset";

export interface FileUploadProps {
    class?: string;
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
    /** The status for a count of files; plural forms are the consumer's. */
    selectedLabel?: (count: number) => string;
    /** The root also accepts dropped files, into the same callback and count; the button stays the keyboard path. */
    dropZone?: boolean;
    [key: string]: unknown;
}

/** The files a drop carries: all of them with `multiple`, else the first. */
function droppedFiles(files: FileList, multiple: boolean): FileList {
    if (multiple || files.length <= 1 || typeof DataTransfer === "undefined") return files;
    const one = new DataTransfer();
    one.items.add(files[0]);
    return one.files;
}

export default function FileUpload(props: FileUploadProps) {
    const p = merge(
        { class: "" as const, multiple: false, disabled: false, dropZone: false },
        props,
    );
    const restProps = omit(
        p,
        "class",
        "label",
        "accept",
        "multiple",
        "disabled",
        "onInputChange",
        "selectedLabel",
        "dropZone",
    );
    const [dragOver, setDragOver] = createSignal(false);
    const inputRef: { current: HTMLInputElement | null } = { current: null };
    const [fileCount, setFileCount] = createSignal(0);

    // Form reset: the browser clears the file input; the count must follow.
    useFormReset(
        () => inputRef.current,
        () => {
            setFileCount(inputRef.current?.files?.length ?? 0);
            p.onInputChange?.(inputRef.current?.files ?? null);
        },
    );

    function handleClick() {
        inputRef.current?.click();
    }

    function handleChange(event: Event & { currentTarget: HTMLInputElement }) {
        const input = event.currentTarget;
        setFileCount(input.files?.length ?? 0);
        p.onInputChange?.(input.files);
    }

    return (
        <div
            class={`file-upload ${p.class}`}
            data-drop-zone={attr(p.dropZone ? "" : undefined)}
            data-drag-over={attr(dragOver() ? "" : undefined)}
            onDragOver={(event) => {
                if (!p.dropZone || p.disabled || !event.dataTransfer?.types.includes("Files"))
                    return;
                event.preventDefault();
                setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(event) => {
                if (!p.dropZone || p.disabled) return;
                event.preventDefault();
                setDragOver(false);
                const files = event.dataTransfer?.files;
                if (!files || files.length === 0) return;
                const chosen = droppedFiles(files, p.multiple);
                setFileCount(chosen.length);
                p.onInputChange?.(chosen);
            }}
            {...restProps}
        >
            <button
                type="button"
                aria-label={p.label}
                disabled={p.disabled}
                onClick={handleClick}
            >
                {p.label}
            </button>
            <input
                ref={(el) => (inputRef.current = el)}
                type="file"
                accept={p.accept}
                multiple={p.multiple}
                hidden
                onChange={handleChange}
            />
            <span
                aria-live="polite"
                data-file-count={attr(fileCount())}
            >
                {fileCount() > 0 && p.selectedLabel ? p.selectedLabel(fileCount()) : null}
            </span>
        </div>
    );
}
