// ShowMore component
//
// A "show more / show less" disclosure for clamped content. The custom
// element stands in for the root div (applySelfClassName). It builds
// `.show-more-content` (holding the consumer's children, always present in
// the accessibility tree) and a `.show-more-button` <button> with
// aria-expanded / aria-controls. The clamp itself is consumer CSS keyed on
// `data-expanded`; no inline style, no `hidden`.
//
// Attributes:
//   more-label — REQUIRED. Button text while collapsed.
//   less-label — REQUIRED. Button text while expanded.
//   expanded — presence-based boolean; bindable via the attribute.
//
// Keyboard: Enter / Space toggle (native <button>).
//
// References:
//   - components/show-more/index.md (canonical contract)

import { applySelfClassName, moveChildrenInto, nextId } from "../lib/dom-utils.js";

export class ShowMore extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["more-label", "less-label", "expanded"];
    }

    #built = false;
    #button: HTMLButtonElement | null = null;
    #content: HTMLDivElement | null = null;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "show-more");
        const contentId = nextId("lily-show-more-content");

        const content = document.createElement("div");
        content.className = "show-more-content";
        content.id = contentId;
        moveChildrenInto(this, content);

        const button = document.createElement("button");
        button.type = "button";
        button.className = "show-more-button";
        button.setAttribute("aria-controls", contentId);
        button.addEventListener("click", this.#onClick);

        this.appendChild(content);
        this.appendChild(button);
        this.#content = content;
        this.#button = button;
        this.#sync();
    }

    attributeChangedCallback(): void {
        this.#sync();
    }

    #sync(): void {
        if (!this.#built) return;
        const expanded = this.hasAttribute("expanded");
        this.#content!.setAttribute("data-expanded", String(expanded));
        this.#button!.setAttribute("aria-expanded", String(expanded));
        this.#button!.textContent = expanded
            ? (this.getAttribute("less-label") ?? "")
            : (this.getAttribute("more-label") ?? "");
    }

    #onClick = (): void => {
        this.toggleAttribute("expanded", !this.hasAttribute("expanded"));
    };
}
