// Open a <dialog> as a real modal (tasks.md P14-T4), shared by Dialog, AlertDialog, FileDialog and TimeoutDialog; the
// same logic as the Svelte catalog's Dialog/modal.ts and this catalog's Drawer.
//
// `modalDialogRef()` returns a function ref for a `<dialog v-if="open" :ref="...">`: when the element mounts it is
// opened with showModal() (top layer, inert page behind, Tab trapped, Escape fires `cancel`), or with the `open`
// attribute when `modal()` is false or showModal is missing (jsdom). Focus moves to the first focusable descendant
// (as showModal does), else the dialog; when the element unmounts it is closed and focus returns to the opener.
import { nextTick } from "vue";

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/** Open `node`: modally where possible, then move focus inside. */
export function showDialog(node: HTMLDialogElement, modal = true): void {
    if (!node.open) {
        if (modal && typeof node.showModal === "function") node.showModal();
        else node.setAttribute("open", "");
    }
    if (!node.contains(document.activeElement)) {
        (node.querySelector<HTMLElement>(FOCUSABLE) ?? node).focus();
    }
}

/** Close `node` if it is open. */
export function hideDialog(node: HTMLDialogElement): void {
    if (!node.open) return;
    if (typeof node.close === "function") node.close();
    else node.removeAttribute("open");
}

/** A function ref that opens the dialog on mount and closes it, returning focus, on unmount. */
export function modalDialogRef(modal: () => boolean = () => true): (el: unknown) => void {
    let current: HTMLDialogElement | null = null;
    let opener: HTMLElement | null = null;
    return (el: unknown) => {
        const node = el instanceof HTMLDialogElement ? el : null;
        if (node === current) return;
        if (current) {
            hideDialog(current);
            if (opener && opener !== document.body && opener.isConnected) opener.focus();
            opener = null;
        }
        current = node;
        if (!node) return;
        opener = document.activeElement as HTMLElement | null;
        if (node.isConnected) showDialog(node, modal());
        else void nextTick(() => current === node && showDialog(node, modal()));
    };
}
