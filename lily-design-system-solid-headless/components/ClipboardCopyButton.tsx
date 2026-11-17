// ClipboardCopyButton component
//
// A headless button that copies specified text to the system clipboard
// using the Clipboard API. It tracks a `copied` state that automatically
// resets after 2 seconds and exposes it via a `data-copied` attribute for
// CSS-based feedback. Commonly used for copy-to-clipboard buttons on code
// snippets, URLs, or shareable content.
//
// Props:
//   class — string, optional. CSS class name.
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

import type { JSX } from "@solidjs/web";
import { omit, createSignal } from "solid-js";
import { withDefaults } from "./defaults";
import { attr } from "./attr";
import { warnMissingName } from "./dev-warning";

export interface ClipboardCopyButtonProps {
    class?: string;
    /** The text to copy to clipboard */
    text: string;
    /** Accessible label for the copy button */
    label: string;
    /** Callback on successful copy */
    onSuccess?: () => void;
    /** Callback on failed copy */
    onError?: (error: unknown) => void;
    /** Optional button content (defaults to empty) */
    children?: JSX.Element;
    [key: string]: unknown;
}

export default function ClipboardCopyButton(props: ClipboardCopyButtonProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(p, "class", "text", "label", "onSuccess", "onError", "children");
    warnMissingName("ClipboardCopyButton", p.label, p["aria-label"], p["aria-labelledby"]);
    const [copied, setCopied] = createSignal(false);

    async function handleClick() {
        try {
            await navigator.clipboard.writeText(p.text);
            setCopied(true);
            p.onSuccess?.();
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            p.onError?.(error);
        }
    }

    return (
        <button
            class={`clipboard-copy-button ${p.class}`}
            type="button"
            aria-label={p.label}
            data-copied={attr(copied())}
            onClick={handleClick}
            {...restProps}
        >
            {p.children && <>{p.children}</>}
        </button>
    );
}
