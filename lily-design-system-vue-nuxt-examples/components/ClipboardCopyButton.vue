<script setup lang="ts">
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
//   onsuccess — () => void, default undefined. Callback invoked after a successful copy.
//   onerror — (error: unknown) => void, default undefined. Callback invoked if the copy fails.
//   default slot. Optional custom button content.
//   ...restProps — additional HTML attributes spread onto the <button>.
//
// Syntax:
//   <ClipboardCopyButton text="https://example.com" label="Copy link" />
//
// Examples:
//   <!-- Copy button with custom content and success callback -->
//   <ClipboardCopyButton text={code} label="Copy code" onsuccess={handleCopied}>
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
//   - Button content is provided through the default slot
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - The copied state auto-resets after 2 seconds via setTimeout
//   - Consumer can use [data-copied="true"] CSS selector for feedback styling
//
// References:
//   - Clipboard API: https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText

import { ref } from "vue";

const props = withDefaults(
    defineProps<{
        /** The text to copy to clipboard */
        text: string;
        /** Accessible label for the copy button */
        label: string;
        /** Callback after successful copy */
        onSuccess?: () => void;
        /** Callback on copy failure */
        onError?: (error: unknown) => void;
    }>(),
    {
        onSuccess: undefined,
        onError: undefined,
    },
);

const copied = ref(false);

async function handleClick() {
    try {
        await navigator.clipboard.writeText(props.text);
        copied.value = true;
        props.onSuccess?.();
        // Reset after a delay
        setTimeout(() => {
            copied.value = false;
        }, 2000);
    } catch (err) {
        props.onError?.(err);
    }
}
</script>

<template>
    <!-- ClipboardCopyButton.vue -->
    <button
        class="clipboard-copy-button"
        type="button"
        :aria-label="label"
        :data-copied="copied"
        @click="handleClick"
    >
        <slot />
    </button>
</template>
