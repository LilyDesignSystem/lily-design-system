// ChatComposer component
//
// A headless chat input form: a <textarea> that grows with its content and ONE button that is
// "send" normally and "stop" while `busy`. Enter sends; Shift+Enter inserts a line break; Enter
// during IME composition is ignored. The send button is disabled, never hidden, when the text is
// empty or the form is disabled. The component never clears the text (the consumer does), never
// animates and carries no strings.
//
// Attributes: label, send-label, stop-label (required words), placeholder, name, min-rows (1),
// max-rows (8), busy (boolean), disabled (boolean), value (initial text). Other attributes (id,
// data-*, aria-*) are passed through to the <form>.
// Property: `value` (live text, get/set).
// Events (bubbling, composed): `lily-send` with detail { value }; `lily-stop`.
// The host's children are rendered inside the form, before the textarea.
//
// References:
//   - components/chat-composer/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "send-label", "stop-label", "placeholder", "name", "min-rows", "max-rows", "busy", "disabled", "value"]);

export class ChatComposer extends HTMLElement {
    static observedAttributes = ["label", "send-label", "stop-label", "placeholder", "name", "min-rows", "max-rows", "busy", "disabled", "value"];

    #form: HTMLFormElement | null = null;
    #textarea: HTMLTextAreaElement | null = null;
    #button: HTMLButtonElement | null = null;
    #label: HTMLSpanElement | null = null;

    connectedCallback(): void {
        if (this.#form) return;
        const form = document.createElement("form");
        form.className = rootClassName(this, "chat-composer");
        passThroughAttributes(this, form, HANDLED);
        moveChildrenInto(this, form);

        const textarea = document.createElement("textarea");
        textarea.className = "chat-composer-input";
        textarea.value = this.getAttribute("value") ?? "";
        const button = document.createElement("button");
        button.className = "chat-composer-button";
        const label = document.createElement("span");
        label.className = "chat-composer-button-label";
        button.appendChild(label);
        form.appendChild(textarea);
        form.appendChild(button);

        textarea.addEventListener("input", this.#onInput);
        textarea.addEventListener("keydown", this.#onKeydown);
        form.addEventListener("submit", this.#onSubmit);
        button.addEventListener("click", this.#onButtonClick);

        this.appendChild(form);
        this.#form = form;
        this.#textarea = textarea;
        this.#button = button;
        this.#label = label;
        this.#sync();
    }

    attributeChangedCallback(name: string): void {
        if (name === "value" && this.#textarea) this.#textarea.value = this.getAttribute("value") ?? "";
        this.#sync();
    }

    get value(): string {
        return this.#textarea?.value ?? this.getAttribute("value") ?? "";
    }

    set value(v: string) {
        if (this.#textarea) this.#textarea.value = v;
        else this.setAttribute("value", v);
        this.#sync();
    }

    get #busy(): boolean {
        return this.hasAttribute("busy");
    }

    get #disabled(): boolean {
        return this.hasAttribute("disabled");
    }

    #sync(): void {
        const ta = this.#textarea;
        const button = this.#button;
        if (!ta || !button || !this.#label) return;
        const label = this.getAttribute("label");
        if (label !== null) ta.setAttribute("aria-label", label);
        else ta.removeAttribute("aria-label");
        for (const [attr, prop] of [["placeholder", "placeholder"], ["name", "name"]] as const) {
            const v = this.getAttribute(attr);
            if (v !== null) ta.setAttribute(prop, v);
            else ta.removeAttribute(prop);
        }
        const min = Number(this.getAttribute("min-rows") ?? 1) || 1;
        const max = Number(this.getAttribute("max-rows") ?? 8) || 8;
        ta.rows = Math.min(max, Math.max(min, ta.value.split("\n").length));
        ta.disabled = this.#disabled;
        const busy = this.#busy;
        button.type = busy ? "button" : "submit";
        button.setAttribute("data-state", busy ? "stop" : "send");
        button.disabled = this.#disabled || (!busy && ta.value.trim() === "");
        this.#label.textContent = (busy ? this.getAttribute("stop-label") : this.getAttribute("send-label")) ?? "";
    }

    #trySend(): void {
        if (this.#disabled || this.#busy || this.value.trim() === "") return;
        this.dispatchEvent(new CustomEvent("lily-send", { detail: { value: this.value }, bubbles: true, composed: true }));
    }

    #onInput = (): void => {
        this.#sync();
    };

    #onKeydown = (event: KeyboardEvent): void => {
        if (event.key !== "Enter") return;
        if (event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) return;
        // IME: Enter that confirms a composition must not send.
        if (event.isComposing || event.keyCode === 229) return;
        event.preventDefault();
        this.#trySend();
    };

    #onSubmit = (event: Event): void => {
        event.preventDefault();
        this.#trySend();
    };

    #onButtonClick = (): void => {
        if (this.#busy) this.dispatchEvent(new CustomEvent("lily-stop", { bubbles: true, composed: true }));
    };
}
