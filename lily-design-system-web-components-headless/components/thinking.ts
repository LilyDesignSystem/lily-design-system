// Thinking component
//
// A native <details> disclosing an assistant's reasoning, closed by
// default. <summary class="thinking-summary"> carries the label and
// <div class="thinking-content"> holds the consumer's children.
//
// Attributes:
//   label — REQUIRED. The summary text.
//   open — presence-based boolean; bindable both ways (attribute and
//     native user interaction stay in sync).
//   streaming — presence-based boolean; sets data-streaming="true" and
//     aria-busy="true" on the root while content is still being produced.
//   ...rest — spread onto the <details>.
//
// Fires a bubbling, composed "lily-change" CustomEvent<{ open: boolean }>
// on user toggles (same as Collapsible).
//
// Keyboard: Enter / Space on the native <summary>.
//
// References:
//   - components/thinking/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "open", "streaming"]);

export class Thinking extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["open", "label", "streaming"];
    }

    #details: HTMLDetailsElement | null = null;
    #summary: HTMLElement | null = null;

    connectedCallback(): void {
        if (!this.#details) {
            const details = document.createElement("details");
            details.className = rootClassName(this, "thinking");
            passThroughAttributes(this, details, HANDLED);
            details.addEventListener("toggle", this.#onToggle);

            const summary = document.createElement("summary");
            summary.className = "thinking-summary";
            details.appendChild(summary);

            const content = document.createElement("div");
            content.className = "thinking-content";
            moveChildrenInto(this, content);
            details.appendChild(content);

            this.appendChild(details);
            this.#details = details;
            this.#summary = summary;
        }
        this.#sync();
    }

    attributeChangedCallback(): void {
        this.#sync();
    }

    #sync(): void {
        const details = this.#details;
        if (!details || !this.#summary) return;
        this.#summary.textContent = this.getAttribute("label") ?? "";
        details.open = this.hasAttribute("open");
        if (this.hasAttribute("streaming")) {
            details.setAttribute("data-streaming", "true");
            details.setAttribute("aria-busy", "true");
        } else {
            details.removeAttribute("data-streaming");
            details.removeAttribute("aria-busy");
        }
    }

    #onToggle = (): void => {
        const open = this.#details?.open ?? false;
        if (open === this.hasAttribute("open")) return;
        this.toggleAttribute("open", open);
        this.dispatchEvent(
            new CustomEvent("lily-change", { detail: { open }, bubbles: true, composed: true }),
        );
    };
}
