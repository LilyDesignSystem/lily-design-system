// StreamingText component
//
// A polite live region for text that grows over time. While `streaming` is true the region is marked busy (`aria-busy="true"`, `data-streaming="true"`) so assistive technology waits instead of announcing every chunk; when it flips to false the finished text is announced once (`role="status"`, `aria-live="polite"`, `aria-atomic="true"`). The component never splits, times, reveals or animates the text: the consumer appends chunks to the children, and owns any caret or reduced-motion CSS.
//
// Attributes:
//   label — optional. Accessible name of the status region, via aria-label.
//   streaming — boolean attribute. While present the region is busy
//     (aria-busy="true", data-streaming="true"). Adding or removing it later
//     updates the region, so a consumer can end the stream by removing it.
//   Other attributes (id, data-*, aria-*) are passed through to the <div>.
//
// The host's children (the text so far) are moved into the <div>; the consumer
// appends later chunks to that <div> (or replaces its text).
//
// References:
//   - components/streaming-text/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "streaming"]);

export class StreamingText extends HTMLElement {
    static observedAttributes = ["label", "streaming"];

    #region: HTMLElement | null = null;

    connectedCallback(): void {
        if (this.#region) return;
        const div = document.createElement("div");
        div.className = rootClassName(this, "streaming-text");
        div.setAttribute("role", "status");
        div.setAttribute("aria-live", "polite");
        div.setAttribute("aria-atomic", "true");
        passThroughAttributes(this, div, HANDLED);
        moveChildrenInto(this, div);
        this.appendChild(div);
        this.#region = div;
        this.#sync();
    }

    attributeChangedCallback(): void {
        this.#sync();
    }

    #sync(): void {
        const div = this.#region;
        if (!div) return;
        const label = this.getAttribute("label");
        if (label !== null) div.setAttribute("aria-label", label);
        else div.removeAttribute("aria-label");
        if (this.hasAttribute("streaming")) {
            div.setAttribute("aria-busy", "true");
            div.setAttribute("data-streaming", "true");
        } else {
            div.removeAttribute("aria-busy");
            div.removeAttribute("data-streaming");
        }
    }
}
