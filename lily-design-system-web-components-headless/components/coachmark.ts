// Coachmark component
//
// A non-blocking <div role="dialog" aria-modal="false"> pointing out a
// single piece of UI, with a title, optional description, and a dismiss
// button. The custom element stands in for the wrapper div directly (see
// lib/dom-utils.applySelfClassName).
//
// Attributes:
//   open — presence-based boolean; the `hidden` attribute reflects !open.
//   title — REQUIRED. Rendered in <h2 class="coachmark-title">.
//   description — optional. Rendered in <p class="coachmark-description">.
//   dismiss-label — REQUIRED. Accessible name for the dismiss button.
//
// Fires a bubbling, composed "lily-dismiss" CustomEvent when the dismiss
// button is activated.
//
// References:
//   - components/coachmark/index.md (canonical contract)

import { applySelfClassName, nextId } from "../lib/dom-utils.js";

export class Coachmark extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["open", "title", "description", "dismiss-label"];
    }

    #titleEl: HTMLElement | null = null;
    #descriptionEl: HTMLElement | null = null;
    #dismissButton: HTMLButtonElement | null = null;
    #titleId = nextId("lily-coachmark-title");
    #descriptionId = nextId("lily-coachmark-description");

    connectedCallback(): void {
        if (this.#titleEl) return;

        applySelfClassName(this, "coachmark");
        this.setAttribute("role", "dialog");
        this.setAttribute("aria-modal", "false");
        this.setAttribute("aria-labelledby", this.#titleId);

        const title = document.createElement("h2");
        title.className = "coachmark-title";
        title.id = this.#titleId;

        const description = document.createElement("p");
        description.className = "coachmark-description";
        description.id = this.#descriptionId;

        const dismiss = document.createElement("button");
        dismiss.type = "button";
        dismiss.className = "coachmark-dismiss";
        dismiss.addEventListener("click", this.#onDismiss);

        const rest = document.createDocumentFragment();
        while (this.firstChild) rest.appendChild(this.firstChild);

        this.appendChild(title);
        this.appendChild(description);
        this.appendChild(dismiss);
        this.appendChild(rest);

        this.#titleEl = title;
        this.#descriptionEl = description;
        this.#dismissButton = dismiss;
        this.#sync();
    }

    attributeChangedCallback(): void {
        this.#sync();
    }

    #sync(): void {
        if (!this.#titleEl || !this.#descriptionEl || !this.#dismissButton) return;
        this.hidden = !this.hasAttribute("open");
        this.#titleEl.textContent = this.getAttribute("title") ?? "";
        const description = this.getAttribute("description");
        this.#descriptionEl.textContent = description ?? "";
        this.#descriptionEl.hidden = description === null;
        if (description !== null) this.setAttribute("aria-describedby", this.#descriptionId);
        else this.removeAttribute("aria-describedby");
        const dismissLabel = this.getAttribute("dismiss-label");
        if (dismissLabel !== null) this.#dismissButton.setAttribute("aria-label", dismissLabel);
    }

    #onDismiss = (): void => {
        this.dispatchEvent(new CustomEvent("lily-dismiss", { bubbles: true, composed: true }));
    };
}
