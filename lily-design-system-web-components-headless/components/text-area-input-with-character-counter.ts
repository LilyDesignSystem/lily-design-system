// TextAreaInputWithCharacterCounter component
//
// A multi-line text area input with a caption below that is a character
// counter "[number] of [maximum] characters". Renders a
// <div class="text-area-input-with-character-counter">; the custom
// element stands in for that div directly (see
// lib/dom-utils.applySelfClassName) since <div> has no native behaviour
// worth preserving as a separate element. Builds a real <textarea> and a
// counter <span> as children: a visible, aria-hidden count and a delayed status.
//
// Attributes:
//   label — REQUIRED. Accessible name for the textarea, via aria-label.
//   value — initial value; also exposed as a live `value` property.
//   max-length — REQUIRED. Maximum number of characters allowed.
//   counter-template — default "{count} / {max}", the numbers alone: no English. `{count}`
//     and `{max}` are replaced with the actual values.
//   rows — optional. Number of visible text rows.
//   placeholder — optional.
//   required, disabled — presence-based booleans.
//
// References:
//   - components/text-area-input-with-character-counter/index.md (canonical contract)
//   - MDN textarea: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea

import { applySelfClassName, nextId } from "../lib/dom-utils.js";

export class TextAreaInputWithCharacterCounter extends HTMLElement {
    #built = false;
    #textarea: HTMLTextAreaElement | null = null;
    #counter: HTMLSpanElement | null = null;
    #template = "{count} / {max}";
    #maxLength = 0;
    #shown: HTMLSpanElement | null = null;
    #status: HTMLSpanElement | null = null;
    #timer: ReturnType<typeof setTimeout> | undefined;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "text-area-input-with-character-counter");

        const textarea = document.createElement("textarea");
        const label = this.getAttribute("label");
        if (label !== null) textarea.setAttribute("aria-label", label);
        textarea.defaultValue = this.getAttribute("value") ?? "";
        this.#maxLength = Number(this.getAttribute("max-length") ?? "0") || 0;
        textarea.maxLength = this.#maxLength;
        const rows = this.getAttribute("rows");
        if (rows !== null) textarea.rows = Number(rows) || 0;
        const placeholder = this.getAttribute("placeholder");
        if (placeholder !== null) textarea.placeholder = placeholder;
        if (this.hasAttribute("required")) textarea.required = true;
        if (this.hasAttribute("disabled")) textarea.disabled = true;

        const counterId = nextId("text-area-input-with-character-counter-counter");
        textarea.setAttribute("aria-describedby", counterId);

        const counter = document.createElement("span");
        counter.id = counterId;
        // The visible count is aria-hidden; a visually hidden role="status" takes the same text once typing has paused for
        // `announce-delay` ms (default 1000), so a run of keystrokes is announced once.
        const shown = document.createElement("span");
        shown.setAttribute("aria-hidden", "true");
        const status = document.createElement("span");
        status.className = "screen-reader-span";
        status.setAttribute("role", "status");
        counter.append(shown, status);
        this.#shown = shown;
        this.#status = status;

        this.#template = this.getAttribute("counter-template") ?? this.#template;

        textarea.addEventListener("input", this.#onInput);

        this.appendChild(textarea);
        this.appendChild(counter);
        this.#textarea = textarea;
        this.#counter = counter;
        this.#updateCounter();
        status.textContent = shown.textContent;
    }

    disconnectedCallback(): void {
        clearTimeout(this.#timer);
    }

    get value(): string {
        return this.#textarea?.value ?? this.getAttribute("value") ?? "";
    }

    set value(v: string) {
        if (this.#textarea) {
            this.#textarea.value = v;
            this.#updateCounter();
        } else {
            this.setAttribute("value", v);
        }
    }

    #onInput = (): void => {
        this.#updateCounter();
    };

    #updateCounter(): void {
        const textarea = this.#textarea;
        const shown = this.#shown;
        const status = this.#status;
        if (!textarea || !shown || !status) return;
        const next = this.#template
            .replace("{count}", String(textarea.value.length))
            .replace("{max}", String(this.#maxLength));
        shown.textContent = next;
        clearTimeout(this.#timer);
        if (status.textContent && status.textContent !== next)
            this.#timer = setTimeout(
                () => (status.textContent = next),
                Number(this.getAttribute("announce-delay") ?? 1000),
            );
    }
}
