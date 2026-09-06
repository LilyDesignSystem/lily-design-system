// NewsletterSignup component
//
// An email subscription <form> with idle/submitting/success/error states.
// Unlike most components in this catalog, this one has a fixed internal
// composition (header, labeled email input, submit button, status
// messages) rather than consumer-supplied light-DOM children — closer in
// shape to Fieldset's built-in <legend> than to Figure's moved children.
// Submitting is left entirely to the consumer: they listen for the
// native "submit" event and drive the `state` attribute (e.g. before/
// after a fetch call) to update the UI.
//
// Attributes:
//   label — REQUIRED. aria-label for the form.
//   heading — optional visible heading.
//   description — optional body text.
//   email-label — REQUIRED. Visible label text for the email input.
//   email-placeholder — optional placeholder for the email input.
//   submit-label — REQUIRED. Submit button text.
//   state — "idle" | "submitting" | "success" | "error", default "idle".
//     Reflected as data-state on the <form>; reactive to later changes.
//   success-message — optional; text of the success status message.
//   error-message — optional; text of the error alert message.
//   ...rest — spread onto the <form>.
//
// References:
//   - components/newsletter-signup/index.md (canonical contract)

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set([
    "label",
    "heading",
    "description",
    "email-label",
    "email-placeholder",
    "submit-label",
    "state",
    "success-message",
    "error-message",
]);

export class NewsletterSignup extends HTMLElement {
    #form: HTMLFormElement | null = null;
    #email: HTMLInputElement | null = null;
    #submit: HTMLButtonElement | null = null;
    #success: HTMLParagraphElement | null = null;
    #error: HTMLParagraphElement | null = null;

    static get observedAttributes(): string[] {
        return ["state"];
    }

    connectedCallback(): void {
        if (this.#form) return;

        const form = document.createElement("form");
        form.className = rootClassName(this, "newsletter-signup");
        const label = this.getAttribute("label");
        if (label !== null) form.setAttribute("aria-label", label);
        passThroughAttributes(this, form, HANDLED);

        const heading = this.getAttribute("heading");
        const description = this.getAttribute("description");
        if (heading !== null || description !== null) {
            const header = document.createElement("header");
            header.className = "newsletter-signup-header";
            if (heading !== null) {
                const h3 = document.createElement("h3");
                h3.className = "newsletter-signup-heading";
                h3.textContent = heading;
                header.appendChild(h3);
            }
            if (description !== null) {
                const p = document.createElement("p");
                p.className = "newsletter-signup-description";
                p.textContent = description;
                header.appendChild(p);
            }
            form.appendChild(header);
        }

        const emailLabel = document.createElement("label");
        emailLabel.className = "newsletter-signup-label";
        emailLabel.appendChild(document.createTextNode(this.getAttribute("email-label") ?? ""));
        const email = document.createElement("input");
        email.type = "email";
        email.className = "newsletter-signup-email";
        const placeholder = this.getAttribute("email-placeholder");
        if (placeholder !== null) email.placeholder = placeholder;
        emailLabel.appendChild(email);
        form.appendChild(emailLabel);

        const submit = document.createElement("button");
        submit.type = "submit";
        submit.className = "newsletter-signup-submit";
        submit.textContent = this.getAttribute("submit-label") ?? "";
        form.appendChild(submit);

        const success = document.createElement("p");
        success.className = "newsletter-signup-success";
        success.setAttribute("role", "status");
        success.setAttribute("aria-live", "polite");
        success.textContent = this.getAttribute("success-message") ?? "";
        form.appendChild(success);

        const error = document.createElement("p");
        error.className = "newsletter-signup-error";
        error.setAttribute("role", "alert");
        error.textContent = this.getAttribute("error-message") ?? "";
        form.appendChild(error);

        this.appendChild(form);
        this.#form = form;
        this.#email = email;
        this.#submit = submit;
        this.#success = success;
        this.#error = error;

        this.#applyState();
    }

    attributeChangedCallback(name: string): void {
        if (name === "state" && this.#form) this.#applyState();
    }

    #applyState(): void {
        const state = this.getAttribute("state") ?? "idle";
        this.#form!.setAttribute("data-state", state);
        const submitting = state === "submitting";
        this.#email!.disabled = submitting;
        this.#submit!.disabled = submitting;
        this.#success!.hidden = state !== "success";
        this.#error!.hidden = state !== "error";
    }
}
