// AlertDialog component
//
// A native <dialog role="alertdialog"> for critical content requiring
// acknowledgment — distinct from Dialog by role and by NOT handling
// Escape itself: the canonical contract makes focus trapping and Escape
// the consumer's responsibility here, because an alert dialog's whole
// point is that dismissing it is a deliberate choice, not a reflex.
//
// Attributes:
//   open — presence-based boolean; bindable.
//   title — REQUIRED. Rendered in <p><strong>, referenced by
//     aria-labelledby.
//   description — optional. Rendered in a <p>, referenced by
//     aria-describedby when present.
//
// References:
//   - components/alert-dialog/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, nextId, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["open", "title", "description"]);

export class AlertDialog extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["open", "title", "description"];
    }

    #dialog: HTMLDialogElement | null = null;
    #titleEl: HTMLElement | null = null;
    #descriptionEl: HTMLElement | null = null;
    #titleId = nextId("lily-alert-dialog-title");
    #descriptionId = nextId("lily-alert-dialog-description");

    connectedCallback(): void {
        if (this.#dialog) return;

        const dialog = document.createElement("dialog");
        dialog.className = rootClassName(this, "alert-dialog");
        dialog.setAttribute("role", "alertdialog");
        dialog.setAttribute("aria-modal", "true");
        dialog.setAttribute("aria-labelledby", this.#titleId);
        passThroughAttributes(this, dialog, HANDLED);

        const titleEl = document.createElement("p");
        const strong = document.createElement("strong");
        strong.id = this.#titleId;
        titleEl.appendChild(strong);
        dialog.appendChild(titleEl);
        this.#titleEl = strong;

        const descriptionEl = document.createElement("p");
        descriptionEl.id = this.#descriptionId;
        dialog.appendChild(descriptionEl);
        this.#descriptionEl = descriptionEl;

        moveChildrenInto(this, dialog);
        this.appendChild(dialog);
        this.#dialog = dialog;
        this.#sync();
    }

    attributeChangedCallback(): void {
        this.#sync();
    }

    #sync(): void {
        const dialog = this.#dialog;
        if (!dialog) return;
        dialog.open = this.hasAttribute("open");
        if (this.#titleEl) this.#titleEl.textContent = this.getAttribute("title") ?? "";
        const description = this.getAttribute("description");
        if (this.#descriptionEl) {
            this.#descriptionEl.textContent = description ?? "";
            this.#descriptionEl.hidden = description === null;
        }
        if (description !== null) dialog.setAttribute("aria-describedby", this.#descriptionId);
        else dialog.removeAttribute("aria-describedby");
    }
}
