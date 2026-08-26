// DownloadButton component
//
// A download link styled as a button. Because download targets should be
// right-clickable and shareable, this is implemented as an <a> element
// with the native `download` attribute, not a <button>.
//
// Props:
//   className    — string, optional. CSS class name appended to the root.
//   href         — string, REQUIRED. File URL.
//   label        — string, REQUIRED. Accessible label (aria-label) and
//                  the default visible text when no children are provided.
//   fileSize     — string, optional. Pre-formatted file size text
//                  (e.g., "2.4 MB"). Exposed via data-file-size.
//   fileFormat   — string, optional. File format text (e.g., "PDF").
//                  Exposed via data-file-format.
//   download     — string | boolean, optional. Native download attribute.
//                  Boolean true sets the attribute with no filename;
//                  string sets the filename.
//   children     — ReactNode, optional. Visible button content (defaults
//                  to label when omitted).
//   ...restProps — additional HTML attributes spread onto the <a>.
//
// Syntax:
//   <DownloadButton
//     href="/files/report.pdf"
//     label="Download annual report (PDF, 2.4 MB)"
//     fileSize="2.4 MB"
//     fileFormat="PDF"
//     download="annual-report.pdf"
//   >
//     Download report
//   </DownloadButton>
//
// Accessibility:
//   - Uses a real <a> element so users can right-click and save
//   - aria-label provides a descriptive name including download intent
//
// Internationalization:
//   - All user-facing strings are consumer-supplied
//
// Claude rules:
//   - Headless: no CSS, no styles
//   - href and label are non-optional in the interface

import React from "react";

export interface DownloadButtonProps {
    className?: string;
    /** File URL */
    href: string;
    /** Accessible label (used as aria-label and default visible text) */
    label: string;
    /** Pre-formatted file size text (e.g., "2.4 MB") */
    fileSize?: string;
    /** File format text (e.g., "PDF") */
    fileFormat?: string;
    /** Native download attribute (true sets it without a filename; string sets filename) */
    download?: string | boolean;
    /** Visible button content; falls back to label */
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function DownloadButton({
    className = "",
    href,
    label,
    fileSize = undefined,
    fileFormat = undefined,
    download = true,
    children,
    ...restProps
}: DownloadButtonProps) {
    const downloadAttr =
        typeof download === "boolean" ? (download ? "" : undefined) : download;

    return (
        <a
            className={`download-button ${className}`}
            href={href}
            aria-label={label}
            data-file-size={fileSize}
            data-file-format={fileFormat}
            download={downloadAttr}
            {...restProps}
        >
            {children ?? label}
        </a>
    );
}
