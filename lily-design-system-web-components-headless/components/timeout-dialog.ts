// TimeoutDialog component
//
// A native <dialog role="alertdialog"> warning users before session
// timeout. Unlike Dialog, this component does not auto-close on Escape —
// the canonical contract makes that a deliberate consumer choice (usually
// wired to "Stay signed in" or "Sign out"), so Escape only dispatches a
// "lily-cancel" CustomEvent, leaving the `open` attribute untouched.
//
// Attributes:
//   open — presence-based boolean; bindable.
//   title — REQUIRED. Rendered in <p><strong>, referenced by
//     aria-labelledby.
//   remaining-seconds — seconds remaining before timeout; exposed as
//     data-remaining-seconds on the rendered dialog so consumer CSS/JS can
//     show the countdown. The consumer drives the countdown clock and its
//     own action buttons (e.g. "Stay signed in", "Sign out") as children.
//
// References:
//   - components/timeout-dialog/index.md (canonical contract)

import { moveChildrenInto, nextId, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["open", "title", "remaining-seconds"]);

export class TimeoutDialog extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["open", "title", "remaining-seconds"];
    }

    #dialog: HTMLDialogElement | null = null;
    #titleEl: HTMLElement | null = null;
    #titleId = nextId("lily-timeout-dialog-title");

    connectedCallback(): void {
        if (this.#dialog) return;

        const dialog = document.createElement("dialog");
        dialog.className = rootClassName(this, "timeout-dialog");
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
        if (this.#titleEl) this.#titleEl.textContent = this.getAttribute("title") ?? "";
        const remaining = this.getAttribute("remaining-seconds");
        if (remaining !== null) dialog.setAttribute("data-remaining-seconds", remaining);
        else dialog.removeAttribute("data-remaining-seconds");
    }

    #onKeydown = (event: KeyboardEvent): void => {
        if (event.key !== "Escape") return;
        event.preventDefault();
        this.dispatchEvent(new CustomEvent("lily-cancel", { bubbles: true, composed: true }));
    };
}
