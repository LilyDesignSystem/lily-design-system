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

const HANDLED = new Set(["open", "label", "modal"]);

export class Dialog extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["open", "label", "modal"];
    }

    #dialog: HTMLDialogElement | null = null;

    connectedCallback(): void {
        if (this.#dialog) return;

        const dialog = document.createElement("dialog");
        dialog.className = rootClassName(this, "dialog");
        dialog.tabIndex = -1;
        passThroughAttributes(this, dialog, HANDLED);
        dialog.addEventListener("keydown", this.#onKeydown);

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
        const label = this.getAttribute("label");
        if (label !== null) dialog.setAttribute("aria-label", label);
        const modal = this.getAttribute("modal");
        if (modal === "false") dialog.removeAttribute("aria-modal");
        else dialog.setAttribute("aria-modal", "true");
    }

    #onKeydown = (event: KeyboardEvent): void => {
        if (event.key !== "Escape") return;
        event.preventDefault();
        this.removeAttribute("open");
        this.dispatchEvent(new CustomEvent("lily-close", { bubbles: true, composed: true }));
    };
}
