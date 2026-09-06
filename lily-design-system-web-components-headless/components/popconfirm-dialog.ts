// PopconfirmDialog component
//
// A non-modal popover dialog with confirm and cancel buttons (e.g. "Are
// you sure?"). Its canonical HTML tag is a plain <div role="alertdialog">
// — not a native <dialog> — matching every framework's port (unlike
// Dialog/AlertDialog, Popconfirm floats next to its trigger rather than
// engaging modal semantics). The custom element stands in for the
// wrapper div directly (see lib/dom-utils.applySelfClassName).
//
// Attributes:
//   open — presence-based boolean; bindable. The `hidden` attribute
//     reflects !open.
//   title — REQUIRED. Rendered in <h2 class="popconfirm-dialog-title">,
//     referenced by aria-labelledby.
//   description — optional. Rendered in
//     <p class="popconfirm-dialog-description">, referenced by
//     aria-describedby when present.
//   confirm-label — REQUIRED. Text for the confirm button.
//   cancel-label — REQUIRED. Text for the cancel button.
//
// Fires bubbling, composed "lily-confirm" / "lily-cancel" CustomEvents
// when the respective button is activated.
//
// References:
//   - components/popconfirm-dialog/index.md (canonical contract)
//   - WAI-ARIA Alert Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/
//   - Ant Design Popconfirm: https://ant.design/components/popconfirm

import { applySelfClassName, nextId } from "../lib/dom-utils.js";

export class PopconfirmDialog extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["open", "title", "description", "confirm-label", "cancel-label"];
    }

    #titleEl: HTMLElement | null = null;
    #descriptionEl: HTMLElement | null = null;
    #cancelButton: HTMLButtonElement | null = null;
    #confirmButton: HTMLButtonElement | null = null;
    #titleId = nextId("lily-popconfirm-dialog-title");
    #descriptionId = nextId("lily-popconfirm-dialog-description");

    connectedCallback(): void {
        if (this.#titleEl) return;

        applySelfClassName(this, "popconfirm-dialog");
        this.setAttribute("role", "alertdialog");
        this.setAttribute("aria-modal", "false");
        this.setAttribute("aria-labelledby", this.#titleId);

        const title = document.createElement("h2");
        title.className = "popconfirm-dialog-title";
        title.id = this.#titleId;

        const description = document.createElement("p");
        description.className = "popconfirm-dialog-description";
        description.id = this.#descriptionId;

        const cancel = document.createElement("button");
        cancel.type = "button";
        cancel.className = "popconfirm-dialog-cancel";
        cancel.addEventListener("click", this.#onCancel);

        const confirm = document.createElement("button");
        confirm.type = "button";
        confirm.className = "popconfirm-dialog-confirm";
        confirm.addEventListener("click", this.#onConfirm);

        this.appendChild(title);
        this.appendChild(description);
        this.appendChild(cancel);
        this.appendChild(confirm);

        this.#titleEl = title;
        this.#descriptionEl = description;
        this.#cancelButton = cancel;
        this.#confirmButton = confirm;
        this.#sync();
    }

    attributeChangedCallback(): void {
        this.#sync();
    }

    #sync(): void {
        if (!this.#titleEl || !this.#descriptionEl || !this.#cancelButton || !this.#confirmButton) return;

        this.hidden = !this.hasAttribute("open");
        this.#titleEl.textContent = this.getAttribute("title") ?? "";

        const description = this.getAttribute("description");
        this.#descriptionEl.textContent = description ?? "";
        this.#descriptionEl.hidden = description === null;
        if (description !== null) this.setAttribute("aria-describedby", this.#descriptionId);
        else this.removeAttribute("aria-describedby");

        this.#cancelButton.textContent = this.getAttribute("cancel-label") ?? "";
        this.#confirmButton.textContent = this.getAttribute("confirm-label") ?? "";
    }

    #onCancel = (): void => {
        this.dispatchEvent(new CustomEvent("lily-cancel", { bubbles: true, composed: true }));
        this.removeAttribute("open");
    };

    #onConfirm = (): void => {
        this.dispatchEvent(new CustomEvent("lily-confirm", { bubbles: true, composed: true }));
        this.removeAttribute("open");
    };
}
