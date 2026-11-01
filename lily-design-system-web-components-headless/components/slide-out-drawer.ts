// SlideOutDrawer component
//
// A drawer that slides out from the side of the page. It is modal (tasks.md P18-T6): the host <lily-slide-out-drawer> wraps a
// native <dialog class="slide-out-drawer"> (the lily-dialog pattern), opened with
// showModal() while the host has `open`. The browser then puts it in the
// top layer, makes the page behind it inert and keeps Tab inside it, so
// aria-modal="true" is true. Where showModal is missing (jsdom, very old
// engines) it falls back to the `open` attribute.
//
// Attributes:
//   open — presence-based boolean; bindable. Shows the dialog as a modal.
//   label — REQUIRED. Accessible name, via aria-label.
//
// Keyboard: Escape (keydown or the native cancel event) closes it: removes
// the host `open` attribute and fires a bubbling, composed "lily-close"
// CustomEvent. Tab stays inside while it is open (showModal()). Opening
// moves focus inside; closing returns focus to the element that had focus
// when it opened.
//
// References:
//   - components/slide-out-drawer/index.md (canonical contract)
//   - WAI-ARIA Dialog (Modal) Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["open", "label"]);

export class SlideOutDrawer extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["open", "label"];
    }

    #dialog: HTMLDialogElement | null = null;
    #opener: HTMLElement | null = null;

    connectedCallback(): void {
        if (this.#dialog) {
            this.#sync();
            return;
        }

        const dialog = document.createElement("dialog");
        dialog.className = rootClassName(this, "slide-out-drawer");
        dialog.tabIndex = -1;
        dialog.setAttribute("aria-modal", "true");
        passThroughAttributes(this, dialog, HANDLED);
        dialog.addEventListener("keydown", this.#onKeydown);
        dialog.addEventListener("cancel", this.#onCancel);
        dialog.addEventListener("close", this.#onClose);

        moveChildrenInto(this, dialog);
        this.appendChild(dialog);
        this.#dialog = dialog;
        this.#sync();
    }

    disconnectedCallback(): void {
        this.#hide();
    }

    attributeChangedCallback(): void {
        this.#sync();
    }

    #sync(): void {
        const dialog = this.#dialog;
        if (!dialog) return;
        const label = this.getAttribute("label");
        if (label !== null) dialog.setAttribute("aria-label", label);
        if (this.hasAttribute("open")) this.#show();
        else this.#hide();
    }

    #show(): void {
        const dialog = this.#dialog;
        if (!dialog || dialog.open || !this.isConnected) return;
        this.#opener = document.activeElement as HTMLElement | null;
        if (typeof dialog.showModal === "function") dialog.showModal();
        else dialog.setAttribute("open", "");
        // showModal() moves focus in a browser; the open-attribute fallback does not.
        if (!dialog.contains(document.activeElement)) dialog.focus();
    }

    #hide(): void {
        const dialog = this.#dialog;
        if (!dialog || !dialog.open) return;
        if (typeof dialog.close === "function") dialog.close();
        else dialog.removeAttribute("open");
        const opener = this.#opener;
        this.#opener = null;
        if (opener && opener !== document.body && opener.isConnected) opener.focus();
    }

    #dismiss(): void {
        if (!this.hasAttribute("open")) return;
        this.removeAttribute("open");
        this.dispatchEvent(new CustomEvent("lily-close", { bubbles: true, composed: true }));
    }

    #onKeydown = (event: KeyboardEvent): void => {
        if (event.key !== "Escape") return;
        event.preventDefault();
        this.#dismiss();
    };

    #onCancel = (event: Event): void => {
        event.preventDefault();
        this.#dismiss();
    };

    // A <form method="dialog"> inside, or a consumer calling close(), closes the native dialog: keep `open` in step.
    #onClose = (): void => {
        this.#dismiss();
    };
}
