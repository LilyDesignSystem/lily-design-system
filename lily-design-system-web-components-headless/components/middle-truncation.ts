// MiddleTruncation component
//
// A string shortened in the middle to fit the width its container gives it ("report-fi…q3.pdf"), keeping the start and
// the end. The width is measured in the browser (canvas text metrics in the element's own font) and re-measured when the
// container resizes; until then the full text is shown.
//
// The full text always stays in the accessibility tree: the shortened string is aria-hidden and the whole text sits in a
// sibling the consumer visually hides. Screen readers, find-in-page and copy get the real text.
//
// Attributes:
//   text — REQUIRED. The full text.
//   ellipsis — REQUIRED. The cut marker. No default: the headless layer ships no text.
//   strategy — "even" (default) | "fixed-end" | "min-end".
//   end — characters kept at the end for "fixed-end" and "min-end".
//   Other attributes (id, data-*, aria-*) are passed through to the inner <span>; the host's class follows the base class.
//
// Markup (light DOM, inside the host):
//   <span class="middle-truncation" data-strategy data-truncated?>
//     <span class="middle-truncation-visual" aria-hidden="true">…</span>
//     <span class="middle-truncation-full">…</span>
//   </span>
//
// Keyboard: none.
//
// References:
//   - components/middle-truncation/index.md (canonical contract)

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";
import { truncateMiddle, type TruncationStrategy } from "../lib/middle-truncation.js";

const HANDLED = new Set(["text", "ellipsis", "strategy", "end"]);

export class MiddleTruncation extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["text", "ellipsis", "strategy", "end"];
    }

    #root: HTMLSpanElement | null = null;
    #visual: HTMLSpanElement | null = null;
    #full: HTMLSpanElement | null = null;
    #observer: ResizeObserver | null = null;
    #frame = 0;
    #context: CanvasRenderingContext2D | null | undefined;

    connectedCallback(): void {
        if (!this.#root) {
            const root = document.createElement("span");
            root.className = rootClassName(this, "middle-truncation");
            passThroughAttributes(this, root, HANDLED);
            const visual = document.createElement("span");
            visual.className = "middle-truncation-visual";
            visual.setAttribute("aria-hidden", "true");
            const full = document.createElement("span");
            full.className = "middle-truncation-full";
            root.append(visual, full);
            this.replaceChildren(root);
            this.#root = root;
            this.#visual = visual;
            this.#full = full;
        }
        this.#recalculate();
        if (typeof ResizeObserver !== "undefined" && this.#root) {
            this.#observer = new ResizeObserver(() => {
                cancelAnimationFrame(this.#frame);
                this.#frame = requestAnimationFrame(() => this.#recalculate());
            });
            this.#observer.observe(this.#root);
        }
    }

    disconnectedCallback(): void {
        cancelAnimationFrame(this.#frame);
        this.#observer?.disconnect();
        this.#observer = null;
    }

    attributeChangedCallback(): void {
        this.#recalculate();
    }

    #recalculate(): void {
        const root = this.#root;
        if (!root || !this.#visual || !this.#full) return;
        const text = this.getAttribute("text") ?? "";
        const ellipsis = this.getAttribute("ellipsis") ?? "";
        const strategy = (this.getAttribute("strategy") ?? "even") as TruncationStrategy;
        const endAttr = this.getAttribute("end");
        const end = endAttr === null ? undefined : Number(endAttr);

        root.setAttribute("data-strategy", strategy);
        this.#full.textContent = text;

        const width = root.clientWidth;
        if (this.#context === undefined) this.#context = document.createElement("canvas").getContext("2d");
        const ctx = this.#context;
        let shown: string | null = null;
        if (ctx && width > 0) {
            const style = getComputedStyle(root);
            ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
            const result = truncateMiddle(text, { ellipsis, strategy, end, maxWidth: width, measure: (s) => ctx.measureText(s).width });
            shown = result === text ? null : result;
        }
        this.#visual.textContent = shown ?? text;
        if (shown === null) root.removeAttribute("data-truncated");
        else root.setAttribute("data-truncated", "");
    }
}
