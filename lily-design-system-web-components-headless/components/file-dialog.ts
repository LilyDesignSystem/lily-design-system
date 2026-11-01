// FileDialog component
//
// A native <dialog>, shown/hidden via its own `open` attribute (not
// `.showModal()`, matching this catalog's Dialog and every other
// framework's port). A dialog for browsing and selecting files — the
// consumer supplies the actual file-picking UI as light-DOM children.
//
// Attributes:
//   open — presence-based boolean; bindable.
//   label — REQUIRED. Accessible name, via aria-label.
//
// aria-modal is always "true" for this component (unlike the plain
// Dialog, FileDialog has no non-modal mode in its canonical contract).
//
// Keyboard: Escape closes (removes the `open` attribute) and fires a
// bubbling, composed "lily-close" CustomEvent.
//
// References:
//   - components/file-dialog/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";
import { ModalDialogState } from "../lib/modal-dialog.js";

const HANDLED = new Set(["open", "label"]);

export class FileDialog extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["open", "label"];
    }

    #dialog: HTMLDialogElement | null = null;
    #modal: ModalDialogState | null = null;

    connectedCallback(): void {
        if (this.#dialog) return;

        const dialog = document.createElement("dialog");
        dialog.className = rootClassName(this, "file-dialog");
        dialog.tabIndex = -1;
        dialog.setAttribute("aria-modal", "true");
        passThroughAttributes(this, dialog, HANDLED);
        dialog.addEventListener("keydown", this.#onKeydown);
        dialog.addEventListener("cancel", this.#onCancel);

        moveChildrenInto(this, dialog);
        this.appendChild(dialog);
        this.#dialog = dialog;
        this.#modal = new ModalDialogState(dialog);
        this.#sync();
    }

    attributeChangedCallback(): void {
        this.#sync();
    }

    #sync(): void {
        const dialog = this.#dialog;
        if (!dialog) return;
        const label = this.getAttribute("label");
        if (label !== null) dialog.setAttribute("aria-label", label);
        this.#modal?.sync(this.hasAttribute("open"));
    }

    // The native cancel event (Escape under showModal()): close through the attribute, as Escape does.
    #onCancel = (event: Event): void => {
        event.preventDefault();
        this.#close();
    };

    #close(): void {
        if (!this.hasAttribute("open")) return;
        this.removeAttribute("open");
        this.dispatchEvent(new CustomEvent("lily-close", { bubbles: true, composed: true }));
    }

    #onKeydown = (event: KeyboardEvent): void => {
        if (event.key !== "Escape") return;
        event.preventDefault();
        this.#close();
    };
}
