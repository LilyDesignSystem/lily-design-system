// Dialog component
//
// A native <dialog>, shown/hidden via its own `open` attribute (not
// `.showModal()` — that would additionally engage the browser's top-layer
// and native focus trap, which the canonical contract leaves to the
// consumer, matching every other framework's port).
//
// Attributes:
//   open — presence-based boolean; bindable (`el.toggleAttribute("open")`
//     works both ways: setting/removing it shows/hides the dialog, and
//     the component's own close paths (Escape) remove it in turn).
//   label — REQUIRED. Accessible name, via aria-label.
//   modal — "true" | "false", default true (absent = true). Controls
//     whether aria-modal is rendered at all; when false, aria-modal is
//     omitted entirely rather than set to "false".
//
// Keyboard: Escape closes (removes the `open` attribute) and fires a
// bubbling, composed "lily-close" CustomEvent.
//
// References:
//   - components/dialog/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";
import { ModalDialogState } from "../lib/modal-dialog.js";

const HANDLED = new Set(["open", "label", "modal"]);

export class Dialog extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["open", "label", "modal"];
    }

    #dialog: HTMLDialogElement | null = null;
    #modal: ModalDialogState | null = null;

    connectedCallback(): void {
        if (this.#dialog) return;

        const dialog = document.createElement("dialog");
        dialog.className = rootClassName(this, "dialog");
        dialog.tabIndex = -1;
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
        const modal = this.getAttribute("modal") !== "false";
        if (modal) dialog.setAttribute("aria-modal", "true");
        else dialog.removeAttribute("aria-modal");
        this.#modal?.sync(this.hasAttribute("open"), modal);
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
        if (event.key !== "Escape" || event.defaultPrevented) return;
        event.preventDefault();
        this.#close();
    };
}
