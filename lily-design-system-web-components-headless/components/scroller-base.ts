// ScrollerBase component
//
// A low-level scroll-position tracking primitive for scrollytelling.
// The custom element stands in for the wrapper div directly (see
// lib/dom-utils.applySelfClassName). Direct children are treated as
// steps: an IntersectionObserver reports the active step index, and a
// passive scroll listener computes overall progress — both are
// component-owned scroll listeners, explicitly permitted by this
// catalog's headless.md ("Components handle: ... IntersectionObserver
// / scroll listeners that belong to the component").
//
// Attributes:
//   label — optional. Accessible label, via aria-label.
//   offset — number (default 0.5). Viewport offset (0-1) where a step
//     triggers (0 = top, 0.5 = center, 1 = bottom).
//
// Exposes live `index`/`progress` properties, and reflects them as
// data-index/data-progress for consumer CSS/JS (headless.md: data-*
// for consumer-observable state). Fires bubbling, composed
// "lily-index-change" / "lily-progress-change" CustomEvents as the
// imperative-DOM equivalent of the canonical contract's bindable
// index/progress props — the callback-prop pattern this catalog has no
// framework reactivity to express directly.
//
// References:
//   - components/scroller-base/index.md (canonical contract)
//   - Reuters Graphics ScrollerBase
//   - IntersectionObserver API

import { applySelfClassName } from "../lib/dom-utils.js";

export class ScrollerBase extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["label"];
    }

    #built = false;
    #observer: IntersectionObserver | null = null;
    #index = 0;
    #progress = 0;

    connectedCallback(): void {
        if (!this.#built) {
            this.#built = true;
            applySelfClassName(this, "scroller-base");
        }
        this.#sync();
        this.#setup();
    }

    disconnectedCallback(): void {
        this.#observer?.disconnect();
        this.#observer = null;
        if (typeof window !== "undefined") window.removeEventListener("scroll", this.#onScroll);
    }

    attributeChangedCallback(): void {
        this.#sync();
    }

    #sync(): void {
        if (!this.#built) return;
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
    }

    get #offset(): number {
        const raw = this.getAttribute("offset");
        return raw !== null ? Number(raw) : 0.5;
    }

    get index(): number {
        return this.#index;
    }

    get progress(): number {
        return this.#progress;
    }

    #setup(): void {
        if (typeof IntersectionObserver === "undefined") return;

        const steps = Array.from(this.children) as HTMLElement[];
        const offset = this.#offset;
        const top = (offset * 100).toFixed(2);
        const bottom = (100 - offset * 100).toFixed(2);

        this.#observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        const idx = steps.indexOf(entry.target as HTMLElement);
                        if (idx !== -1) this.#setIndex(idx);
                    }
                }
            },
            { rootMargin: `-${top}% 0px -${bottom}% 0px`, threshold: 0 },
        );
        for (const step of steps) this.#observer.observe(step);

        if (typeof window !== "undefined") {
            window.addEventListener("scroll", this.#onScroll, { passive: true });
            this.#onScroll();
        }
    }

    #onScroll = (): void => {
        const rect = this.getBoundingClientRect();
        const winH = window.innerHeight || 1;
        const total = rect.height + winH;
        const passed = winH - rect.top;
        this.#setProgress(Math.max(0, Math.min(1, passed / total)));
    };

    #setIndex(index: number): void {
        this.#index = index;
        this.setAttribute("data-index", String(index));
        this.dispatchEvent(
            new CustomEvent("lily-index-change", { detail: { index }, bubbles: true, composed: true }),
        );
    }

    #setProgress(progress: number): void {
        this.#progress = progress;
        this.setAttribute("data-progress", String(progress));
        this.dispatchEvent(
            new CustomEvent("lily-progress-change", { detail: { progress }, bubbles: true, composed: true }),
        );
    }
}
