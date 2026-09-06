// ClampText component
//
// A text container that truncates content to a maximum number of lines. A
// plain <div> — the custom element stands in for the wrapper div directly
// (see lib/dom-utils.applySelfClassName). Exposes `--clamp-text-lines` as
// an inline CSS custom property (headless.md's own carve-out: "CSS custom
// properties applied as variables" is an explicitly sanctioned inline-style
// use, unlike a literal visual property) and `data-lines` for consumer CSS
// hooks; all visual line-clamping stays in the consumer stylesheet. The
// full content stays in the DOM so screen readers can access it.
//
// Attributes:
//   lines — number, default 2. Maximum visible lines.
//   label — optional. Accessible name via aria-label.
//
// References:
//   - components/clamp-text/index.md (canonical contract)
//   - MDN line-clamp: https://developer.mozilla.org/en-US/docs/Web/CSS/line-clamp

import { applySelfClassName } from "../lib/dom-utils.js";

export class ClampText extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["lines", "label"];
    }

    #built = false;

    connectedCallback(): void {
        if (!this.#built) {
            this.#built = true;
            applySelfClassName(this, "clamp-text");
        }
        this.#sync();
    }

    attributeChangedCallback(): void {
        this.#sync();
    }

    #sync(): void {
        if (!this.#built) return;
        const lines = this.getAttribute("lines") ?? "2";
        this.setAttribute("data-lines", lines);
        this.style.setProperty("--clamp-text-lines", lines);

        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
        else this.removeAttribute("aria-label");
    }
}
