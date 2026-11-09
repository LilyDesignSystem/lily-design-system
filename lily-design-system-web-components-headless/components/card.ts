// Card component
//
// A <div> grouping one card's content (role="group" when labelled), with an
// optional heading (levels 2–6) that becomes a link when `href` is supplied.
//
// Attributes:
//   heading — optional heading text.
//   heading-level — "2" | "3" | "4" | "5" | "6", default "3".
//   href — optional; wraps the heading text in an <a>.
//   label — optional; names the card, which then has role="group".
//
// References:
//   - components/card/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["heading", "heading-level", "href", "label"]);

export class Card extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > div.card")) return;

        const root = document.createElement("div");
        root.className = rootClassName(this, "card");
        const label = this.getAttribute("label");
        if (label) {
            root.setAttribute("role", "group");
            root.setAttribute("aria-label", label);
        }
        passThroughAttributes(this, root, HANDLED);

        const heading = this.getAttribute("heading");
        if (heading !== null) {
            const level = this.getAttribute("heading-level") ?? "3";
            const h = document.createElement(`h${level}`);
            const href = this.getAttribute("href");
            if (href !== null) {
                const a = document.createElement("a");
                a.href = href;
                a.textContent = heading;
                h.appendChild(a);
            } else {
                h.textContent = heading;
            }
            root.appendChild(h);
        }

        moveChildrenInto(this, root);
        this.appendChild(root);
    }
}
