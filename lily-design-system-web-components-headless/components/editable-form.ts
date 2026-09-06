// EditableForm component
//
// A <form> wrapper for inline editing of content, shown only while
// `editing` is present. Unlike the framework ports (which literally
// mount/unmount the <form>), this always builds the inner <form> once
// and toggles it with the `hidden` content attribute — equivalent for
// both the accessibility tree and visual rendering (a hidden element is
// not exposed to assistive technology), without repeatedly relocating
// children between a detached holder and the live DOM.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   editing — presence-based boolean; bindable. Controls visibility.
//   ...rest — spread onto the <form>.
//
// The native <form> "submit" default is prevented so the consumer can
// implement save logic without a page navigation, and `editing` reverts;
// the still-dispatched, bubbling "submit" event is the onSubmit
// callback's equivalent. Escape cancels: it reverts `editing` and fires
// a bubbling, composed "lily-cancel" CustomEvent (the onCancel
// callback's equivalent, since a plain DOM event has no return value to
// carry a callback-style API).
//
// Keyboard: Enter submits (native <form> behaviour); Escape cancels.
//
// References:
//   - components/editable-form/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "editing"]);

export class EditableForm extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["editing", "label"];
    }

    #form: HTMLFormElement | null = null;

    connectedCallback(): void {
        if (this.#form) return;

        const form = document.createElement("form");
        form.className = rootClassName(this, "editable-form");
        form.tabIndex = -1;
        passThroughAttributes(this, form, HANDLED);
        form.addEventListener("submit", this.#onSubmit);
        form.addEventListener("keydown", this.#onKeydown);

        moveChildrenInto(this, form);
        this.appendChild(form);
        this.#form = form;
        this.#sync();
    }

    attributeChangedCallback(): void {
        this.#sync();
    }

    #sync(): void {
        const form = this.#form;
        if (!form) return;
        const label = this.getAttribute("label");
        if (label !== null) form.setAttribute("aria-label", label);
        form.hidden = !this.hasAttribute("editing");
    }

    #onSubmit = (event: SubmitEvent): void => {
        event.preventDefault();
        this.removeAttribute("editing");
    };

    #onKeydown = (event: KeyboardEvent): void => {
        if (event.key !== "Escape") return;
        event.preventDefault();
        this.removeAttribute("editing");
        this.dispatchEvent(new CustomEvent("lily-cancel", { bubbles: true, composed: true }));
    };
}
