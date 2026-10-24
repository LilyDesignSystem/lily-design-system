// Show a <dialog> as a real modal, or as a plain open dialog.
//
// A modal dialog is opened with `showModal()`: the browser puts it in the top layer, makes the rest of the page
// inert (no pointer, no keyboard, no assistive-technology access behind it), traps Tab inside it, moves focus to
// it and returns focus to the opener when it closes. Setting the `open` attribute does none of that, so a dialog
// that only sets `open` and says `aria-modal="true"` claims a modality it does not have.
//
// Where `showModal` is missing (jsdom, very old browsers) the dialog falls back to the `open` attribute, which
// keeps it visible and testable. Used as `use:modalDialog={modal}`.

export function modalDialog(node: HTMLDialogElement, enabled: boolean) {
    let modal = enabled;
    // Where focus was when the dialog opened. A native close() would hand focus back there, but Svelte takes the element
    // out of the page before this action's cleanup runs, so by then the browser can no longer do it: we do.
    const opener = typeof document === "undefined" ? null : (document.activeElement as HTMLElement | null);

    function show(): void {
        if (node.open) return;
        if (modal && typeof node.showModal === "function") node.showModal();
        else node.setAttribute("open", "");
    }

    function hide(): void {
        if (!node.open) return;
        if (typeof node.close === "function") node.close();
        else node.removeAttribute("open");
    }

    show();
    return {
        update(next: boolean) {
            if (next === modal) return;
            // Modal and non-modal are different openings: close the old one and open the new one.
            hide();
            modal = next;
            show();
        },
        destroy() {
            hide();
            if (opener && opener !== document.body && opener.isConnected) opener.focus();
        },
    };
}
