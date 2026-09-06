// Scroller component
//
// A scrollytelling container: a sticky background that updates as
// foreground "step" children scroll past. The custom element stands in
// for the wrapper div directly (see lib/dom-utils.applySelfClassName).
//
// Builds on the same IntersectionObserver-based step-tracking primitive
// as ScrollerBase, duplicated locally here rather than instantiating a
// second custom element from within this class — this catalog's
// established composition convention (see five-star-rating-picker.ts)
// is that a sibling custom element is composed by the CONSUMER writing
// its tag directly in markup, not by one component class instantiating
// another's class internally.
//
// Attributes:
//   label — optional. Accessible label for the scroller region, via
//     aria-label.
//   offset — number (default 0.5). Viewport offset (0-1) where a step
//     triggers.
//
// A light-DOM child marked slot="background" (the BarChart
// data-table-slot convention) becomes the sticky background, moved into
// a generated `.scroller-background[aria-live=polite]` div; all
// remaining children become scrollytelling steps, moved into a
// generated `.scroller-foreground.scroller-base` div.
//
// Exposes live `index`/`progress` properties and fires bubbling,
// composed "lily-index-change" / "lily-progress-change" CustomEvents —
// the imperative-DOM equivalent of the canonical contract's bindable
// index/progress props.
//
// References:
//   - components/scroller/index.md (canonical contract)
//   - Reuters Graphics Scroller

import { applySelfClassName } from "../lib/dom-utils.js";

export class Scroller extends HTMLElement {
    #built = false;
    #observer: IntersectionObserver | null = null;
    #foreground: HTMLElement | null = null;
    #index = 0;
    #progress = 0;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "scroller");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);

        const backgroundContent = this.querySelector(':scope > [slot="background"]');
        const steps = Array.from(this.children).filter((child) => child !== backgroundContent);

        const background = document.createElement("div");
        background.className = "scroller-background";
        background.setAttribute("aria-live", "polite");
        if (backgroundContent) background.appendChild(backgroundContent);

        const foreground = document.createElement("div");
        foreground.className = "scroller-foreground scroller-base";
        for (const step of steps) foreground.appendChild(step);

        this.replaceChildren(background, foreground);
        this.#foreground = foreground;

        this.#setupStepTracking();
    }

    disconnectedCallback(): void {
        this.#observer?.disconnect();
        this.#observer = null;
        if (typeof window !== "undefined") window.removeEventListener("scroll", this.#onScroll);
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

    #setupStepTracking(): void {
        const foreground = this.#foreground;
        if (!foreground || typeof IntersectionObserver === "undefined") return;

        const steps = Array.from(foreground.children) as HTMLElement[];
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
