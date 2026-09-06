// Visible component
//
// An IntersectionObserver wrapper that exposes element visibility state.
// Renders a <div>; the custom element stands in for that div directly
// (see lib/dom-utils.applySelfClassName) since <div> has no native
// behaviour worth preserving as a separate element.
//
// DEVIATION FLAG: the framework ports pass the visibility boolean to a
// render-prop/snippet `children` callback — there is no equivalent
// primitive here. This port instead reflects visibility as `data-visible`
// (matching this catalog's data-attribute convention, AGENTS/headless.md)
// and fires a bubbling, composed "lily-visibility-change"
// CustomEvent<{ visible: boolean }> on every change, so a consumer can
// drive lazy loading / animations / analytics either from CSS
// (`[data-visible="true"]`) or from the event.
//
// Attributes:
//   once — presence-based boolean; disconnects the observer after the
//     first intersection (for lazy loading).
//   threshold — number (0-1), default 0. IntersectionObserver threshold.
//   root-margin — default "0px". IntersectionObserver root margin.
//
// References:
//   - components/visible/index.md (canonical contract)
//   - Reuters Graphics Visible component
//   - IntersectionObserver API

import { applySelfClassName } from "../lib/dom-utils.js";

export class Visible extends HTMLElement {
    #built = false;
    #observer: IntersectionObserver | null = null;
    #visible = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "visible");
        this.setAttribute("data-visible", "false");

        if (typeof IntersectionObserver === "undefined") return;
        const once = this.hasAttribute("once");
        const threshold = Number(this.getAttribute("threshold") ?? "0") || 0;
        const rootMargin = this.getAttribute("root-margin") ?? "0px";

        this.#observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.target !== this) continue;
                    this.#setVisible(entry.isIntersecting);
                    if (once && entry.isIntersecting) this.#observer?.disconnect();
                }
            },
            { threshold, rootMargin },
        );
        this.#observer.observe(this);
    }

    disconnectedCallback(): void {
        this.#observer?.disconnect();
        this.#observer = null;
    }

    get visible(): boolean {
        return this.#visible;
    }

    #setVisible(value: boolean): void {
        if (this.#visible === value) return;
        this.#visible = value;
        this.setAttribute("data-visible", String(value));
        this.dispatchEvent(
            new CustomEvent("lily-visibility-change", { detail: { visible: value }, bubbles: true, composed: true }),
        );
    }
}
