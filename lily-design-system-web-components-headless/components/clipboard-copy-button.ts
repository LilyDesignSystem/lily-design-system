// ClipboardCopyButton component
//
// A button that copies text to the clipboard via navigator.clipboard, with
// data-copied reflecting the outcome for CSS-based feedback and a 2-second
// auto-reset back to the un-copied state.
//
// Attributes:
//   text — REQUIRED. The text to copy.
//   label — REQUIRED. Accessible name, via aria-label.
//
// Fires (on the host, bubbling + composed):
//   "lily-success" — CustomEvent<void>, after a successful copy.
//   "lily-error" — CustomEvent<{ error: unknown }>, if the copy fails.
//
// References:
//   - components/clipboard-copy-button/index.md (canonical contract)
//   - Clipboard API: https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const RESET_MS = 2000;
const HANDLED = new Set(["text", "label"]);

export class ClipboardCopyButton extends HTMLElement {
    #button: HTMLButtonElement | null = null;
    #resetTimer: ReturnType<typeof setTimeout> | undefined;

    connectedCallback(): void {
        if (this.#button) return;

        const button = document.createElement("button");
        button.type = "button";
        button.className = rootClassName(this, "clipboard-copy-button");
        const label = this.getAttribute("label");
        if (label !== null) button.setAttribute("aria-label", label);
        button.setAttribute("data-copied", "false");
        passThroughAttributes(this, button, HANDLED);
        button.addEventListener("click", this.#onClick);

        moveChildrenInto(this, button);
        this.appendChild(button);
        this.#button = button;
    }

    disconnectedCallback(): void {
        clearTimeout(this.#resetTimer);
    }

    #onClick = async (): Promise<void> => {
        const text = this.getAttribute("text") ?? "";
        try {
            await navigator.clipboard.writeText(text);
            this.#button?.setAttribute("data-copied", "true");
            clearTimeout(this.#resetTimer);
            this.#resetTimer = setTimeout(() => {
                this.#button?.setAttribute("data-copied", "false");
            }, RESET_MS);
            this.dispatchEvent(new CustomEvent("lily-success", { bubbles: true, composed: true }));
        } catch (error) {
            this.dispatchEvent(
                new CustomEvent("lily-error", { detail: { error }, bubbles: true, composed: true }),
            );
        }
    };
}
