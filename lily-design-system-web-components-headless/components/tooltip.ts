// Tooltip component
//
// A small popup showing descriptive text on hover or focus. Wraps a real
// <div role="tooltip">.
//
// DEVIATION FLAG: the canonical Svelte implementation fully unmounts the
// tooltip from the DOM when `visible` is false (a framework-native `{#if}`).
// There is no equivalent primitive for an autonomous custom element without
// destroying the host itself (which would discard the consumer's element
// entirely, not just its content) — this catalog's own established idiom
// for exactly this shape is Dialog's `open` attribute toggling the real
// element's `hidden`/`open` state instead of removing it (see dialog.ts).
// This port follows that idiom: `visible` (bindable, like Dialog's `open`)
// toggles the inner element's `hidden` property, which is equivalent from
// both a visual and an assistive-technology standpoint.
//
// Attributes:
//   label — REQUIRED. The tooltip text content.
//   visible — presence-based boolean; bindable. Absent by default (the
//     tooltip starts hidden).
//   id — optional; for linking to a trigger element via aria-describedby.
//
// Keyboard: none built in — the consumer hides the tooltip on Escape by
// toggling `visible` (per the canonical contract).
//
// References:
//   - components/tooltip/index.md (canonical contract)
//   - WAI-ARIA Tooltip Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "visible", "id"]);

export class Tooltip extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["label", "visible", "id"];
    }

    #tooltip: HTMLDivElement | null = null;

    connectedCallback(): void {
        if (!this.#tooltip) {
            const tooltip = document.createElement("div");
            tooltip.className = rootClassName(this, "tooltip");
            tooltip.setAttribute("role", "tooltip");
            passThroughAttributes(this, tooltip, HANDLED);
            this.appendChild(tooltip);
            this.#tooltip = tooltip;
        }
        this.#sync();
    }

    attributeChangedCallback(): void {
        this.#sync();
    }

    #sync(): void {
        const tooltip = this.#tooltip;
        if (!tooltip) return;
        tooltip.textContent = this.getAttribute("label") ?? "";
        // The `id` belongs on the ARIA tooltip node itself (what a trigger's
        // aria-describedby resolves to), not the inert host wrapper — leaving
        // it on both would be a duplicate id in the document.
        const id = this.getAttribute("id");
        if (id !== null) {
            tooltip.id = id;
            this.removeAttribute("id");
        }
        tooltip.hidden = !this.hasAttribute("visible");
    }
}
