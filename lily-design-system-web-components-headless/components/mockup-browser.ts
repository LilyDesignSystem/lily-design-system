// MockupBrowser component
//
// A decorative <div> that looks like a web browser chrome, framing
// consumer-supplied content. The custom element stands in for the
// wrapper div directly (see lib/dom-utils.applySelfClassName). All
// visual chrome (address bar, tabs, traffic lights) is the consumer's
// CSS — this component contributes only the class hook and an optional
// accessible name.
//
// Attributes:
//   label — optional. Accessible name describing the mockup content, via
//     aria-label.
//
// References:
//   - components/mockup-browser/index.md (canonical contract)

import { applySelfClassName, followSelf } from "../lib/dom-utils.js";

export class MockupBrowser extends HTMLElement {
    #built = false;

    // A change to label or class is shown (tasks.md P50-T28).
    static get observedAttributes(): string[] {
        return ["label", "class"];
    }

    attributeChangedCallback(name: string): void {
        if (this.#built) followSelf(this, "mockup-browser", name);
    }

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "mockup-browser");
        const label = this.getAttribute("label");
        if (!this.hasAttribute("role")) this.setAttribute("role", "img");
        if (label !== null) this.setAttribute("aria-label", label);
    }
}
