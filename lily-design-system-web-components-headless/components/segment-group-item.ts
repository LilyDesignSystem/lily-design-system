// SegmentGroupItem component
//
// One selectable segment inside a SegmentGroup, following the WAI-ARIA
// Radio Group pattern's item shape (role="radio" on a real <button>).
//
// DEVIATION FLAG: the canonical AGENTS.md Metadata table literally says
// "HTML tag: <div>", but that contradicts the same document's own Key
// Behaviors ("Renders a `<button>` element with `role=\"radio\"`"),
// Keyboard section ("Space/Enter: Activates the focused segment (native
// button behavior)"), and the plain-HTML sibling
// (lily-design-system-html-headless/components/segment-group-item.html),
// which literally renders `<button class="segment-group-item" ...>`.
// A `<div role="radio">` would also be exactly the "role=button-on-a-div
// is a smell" case AGENTS/headless.md warns against, and would need this
// component to hand-roll Enter/Space activation and focusability that a
// real <button> gets for free. This implementation follows <button> as
// the real, intended contract and treats the Metadata table's "<div>" as
// a stale/generated error, not the source of truth.
//
// Attributes:
//   checked — presence-based boolean; reflected to aria-checked and
//     roving tabindex. The consumer owns selection state (this component
//     does not toggle itself on click — SegmentGroup's contract says the
//     consumer manages `aria-checked` on children).
//   value — exposed as data-value for CSS/JS.
//   disabled — presence-based boolean.
//   ...rest — spread onto the <button>.
//
// Keyboard: Tab focuses the checked segment (roving tabindex); Enter or
// Space activates via native <button> behaviour. Arrow-key navigation
// between segments is the parent SegmentGroup's/consumer's concern.
//
// References:
//   - components/segment-group-item/index.md (canonical contract)
//   - WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radio/

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["checked", "value", "disabled"]);

export class SegmentGroupItem extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["checked", "value", "disabled"];
    }

    #button: HTMLButtonElement | null = null;

    connectedCallback(): void {
        if (this.#button) {
            this.#sync();
            return;
        }

        const button = document.createElement("button");
        button.type = "button";
        button.className = rootClassName(this, "segment-group-item");
        button.setAttribute("role", "radio");
        passThroughAttributes(this, button, HANDLED);

        moveChildrenInto(this, button);
        this.appendChild(button);
        this.#button = button;
        this.#sync();
    }

    attributeChangedCallback(): void {
        this.#sync();
    }

    #sync(): void {
        const button = this.#button;
        if (!button) return;
        const checked = this.hasAttribute("checked");
        button.setAttribute("aria-checked", checked ? "true" : "false");
        button.tabIndex = checked ? 0 : -1;
        const value = this.getAttribute("value");
        if (value !== null) button.setAttribute("data-value", value);
        button.disabled = this.hasAttribute("disabled");
    }
}
