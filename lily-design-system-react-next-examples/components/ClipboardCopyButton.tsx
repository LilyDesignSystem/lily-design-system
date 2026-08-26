// ClipboardCopyButton component
//
// A headless button that copies specified text to the system clipboard
// using the Clipboard API. It tracks a `copied` state that automatically
// resets after 2 seconds and exposes it via a `data-copied` attribute for
// CSS-based feedback. Commonly used for copy-to-clipboard buttons on code
// snippets, URLs, or shareable content.
//
// Props:
//   className — string, optional. CSS class name.
//   text — string, required. The text to copy to the clipboard.
//   label — string, required. Accessible label for the copy button via aria-label.
//   onSuccess — () => void, default undefined. Callback invoked after a successful copy.
//   onError — (error: unknown) => void, default undefined. Callback invoked if the copy fails.
//   children — ReactNode, default undefined. Optional custom button content.
//   ...restProps — additional HTML attributes spread onto the <button>.
//
// Syntax:
//   <ClipboardCopyButton text="https://example.com" label="Copy link" />
//
// Examples:
//   
//   <ClipboardCopyButton text={code} label="Copy code" onSuccess={handleCopied}>
//     Copy to clipboard
//   </ClipboardCopyButton>
//
// Keyboard:
//   - Enter: Activate the copy button (native button behavior)
//   - Space: Activate the copy button (native button behavior)
//
// Accessibility:
//   - Implicit button role from the <button> element
//   - aria-label describes the copy action for screen readers
//   - data-copied attribute reflects "true" or "false" for CSS-based visual feedback
//
// Internationalization:
//   - The label prop provides the accessible name; no hardcoded strings
//   - Button content is provided through the children prop
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - The copied state auto-resets after 2 seconds via setTimeout
//   - Consumer can use [data-copied="true"] CSS selector for feedback styling
//
// References:
//   - Clipboard API: https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText

import React, { useState } from "react";

export interface ClipboardCopyButtonProps {
    className?: string;
    /** The text to copy to clipboard */
    text: string;
    /** Accessible label for the copy button */
    label: string;
    /** Callback on successful copy */
    onSuccess?: () => void;
    /** Callback on failed copy */
    onError?: (error: unknown) => void;
    /** Optional button content (defaults to empty) */
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function ClipboardCopyButton({
    className = "",
    text,
    label,
    onSuccess = undefined,
    onError = undefined,
    children,
    ...restProps
}: ClipboardCopyButtonProps) {
    const [copied, setCopied] = useState(false);

    async function handleClick() {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            onSuccess?.();
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            onError?.(error);
        }
    }

    return (
        <button
        className={`clipboard-copy-button ${className}`}
        type="button"
        aria-label={label}
        data-copied={copied}
        onClick={handleClick}
        {...restProps}
        >
        {children && (<>{children}</>)}
        </button>
    );
}
