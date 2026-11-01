// Modal dialog interop for Drawer, Sheet and SlideOutDrawer (tasks.md P18-T6).
//
// C# cannot call showModal(), so the three modal panels load this collocated module after they render their
// <dialog>. showModal() puts the dialog in the top layer, makes the page behind it inert, traps Tab inside it and
// turns Escape into a `cancel` event (the component closes on it). Where showModal is missing it falls back to the
// `open` attribute. open() returns a handle whose close() closes the dialog and gives focus back to the element
// that had it when the dialog opened.

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

// `modal` (default true) opens with showModal(); false, or a missing showModal, with the open attribute. Also used by
// Dialog, AlertDialog, FileDialog and TimeoutDialog (tasks.md P14-T4).
export function open(dialog, modal = true) {
    const opener = document.activeElement;
    if (!dialog.open) {
        if (modal && typeof dialog.showModal === "function") dialog.showModal();
        else dialog.setAttribute("open", "");
    }
    // showModal() focuses the first focusable descendant itself; do the same otherwise, else the dialog.
    if (!dialog.contains(document.activeElement)) (dialog.querySelector(FOCUSABLE) ?? dialog).focus();
    return {
        close() {
            if (dialog.open) {
                if (typeof dialog.close === "function") dialog.close();
                else dialog.removeAttribute("open");
            }
            if (opener && opener !== document.body && opener.isConnected) opener.focus();
        },
    };
}
