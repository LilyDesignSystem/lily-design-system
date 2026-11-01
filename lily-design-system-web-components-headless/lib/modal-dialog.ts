// Show and hide a <dialog> as a real modal (tasks.md P14-T4), shared by dialog, alert-dialog, file-dialog and
// timeout-dialog; the same logic as the Svelte catalog's Dialog/modal.ts.
//
// `sync(open, modal)` opens the dialog with showModal() when `modal` (top layer, inert page behind, Tab trapped,
// Escape firing `cancel`), else with the `open` attribute, which is also the fallback where showModal is missing
// (jsdom). Opening moves focus to the first focusable descendant (as showModal does), else the dialog; closing
// returns focus to the element that had it when the dialog opened.

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export class ModalDialogState {
    readonly #dialog: HTMLDialogElement;
    #opener: HTMLElement | null = null;

    constructor(dialog: HTMLDialogElement) {
        this.#dialog = dialog;
    }

    sync(open: boolean, modal = true): void {
        const dialog = this.#dialog;
        if (open && !dialog.open) {
            this.#opener = document.activeElement as HTMLElement | null;
            if (modal && dialog.isConnected && typeof dialog.showModal === "function")
                dialog.showModal();
            else dialog.setAttribute("open", "");
            if (!dialog.contains(document.activeElement)) {
                (dialog.querySelector<HTMLElement>(FOCUSABLE) ?? dialog).focus();
            }
        } else if (!open && dialog.open) {
            if (typeof dialog.close === "function") dialog.close();
            else dialog.removeAttribute("open");
            const opener = this.#opener;
            this.#opener = null;
            if (opener && opener !== document.body && opener.isConnected) opener.focus();
        }
    }
}
