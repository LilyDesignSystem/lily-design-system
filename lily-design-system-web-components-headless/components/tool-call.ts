// ToolCall component
//
// A headless disclosure for one tool invocation, built on the native <details>. Closed by default. The `summary` content (typically ToolCallName and ToolCallStatus) goes inside <summary class="tool-call-summary">; the body (ToolCallInput, ToolCallOutput, ToolCallError) goes inside <div class="tool-call-content">. `status` (pending | running | done | error) sets data-status on the root, and aria-busy="true" only while running. The component never animates, times or opens itself: the consumer owns `open` (open it on error so ToolCallError is not hidden) and any spinner/animation CSS.
//
// Attributes:
//   open — boolean attribute; reflects the <details> open state both ways
//     (a native toggle updates the attribute and fires a `lily-change` CustomEvent).
//   status — pending | running | done | error. Sets data-status; aria-busy only for running.
//   Other attributes (id, data-*, aria-*) are passed through to the <details>.
// Children with slot="summary" go in <summary class="tool-call-summary">; all
// other children go in <div class="tool-call-content">.
//
// References:
//   - components/tool-call/index.md (canonical contract)

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["open", "status"]);

export class ToolCall extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["open", "status"];
    }

    #details: HTMLDetailsElement | null = null;

    connectedCallback(): void {
        if (!this.#details) {
            const details = document.createElement("details");
            details.className = rootClassName(this, "tool-call");
            passThroughAttributes(this, details, HANDLED);
            details.addEventListener("toggle", this.#onToggle);

            const summary = document.createElement("summary");
            summary.className = "tool-call-summary";
            details.appendChild(summary);
            const content = document.createElement("div");
            content.className = "tool-call-content";
            details.appendChild(content);

            for (const child of Array.from(this.childNodes)) {
                if (child instanceof Element && child.getAttribute("slot") === "summary") summary.appendChild(child);
                else content.appendChild(child);
            }
            this.appendChild(details);
            this.#details = details;
        }
        this.#sync();
    }

    attributeChangedCallback(): void {
        this.#sync();
    }

    #sync(): void {
        const details = this.#details;
        if (!details) return;
        details.open = this.hasAttribute("open");
        const status = this.getAttribute("status");
        if (status) details.setAttribute("data-status", status);
        else details.removeAttribute("data-status");
        if (status === "running") details.setAttribute("aria-busy", "true");
        else details.removeAttribute("aria-busy");
    }

    #onToggle = (): void => {
        const open = this.#details?.open ?? false;
        if (open === this.hasAttribute("open")) return;
        this.toggleAttribute("open", open);
        this.dispatchEvent(new CustomEvent("lily-change", { detail: { open }, bubbles: true, composed: true }));
    };
}
