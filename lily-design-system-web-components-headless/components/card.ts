// Card component
//
// An <article> for semantic standalone content grouping, with an optional
// heading (levels 2–6) that becomes a link when `href` is supplied.
//
// Attributes:
//   heading — optional heading text.
//   heading-level — "2" | "3" | "4" | "5" | "6", default "3".
//   href — optional; wraps the heading text in an <a>.
//   label — optional; aria-label for the article (named-landmark use).
//
// References:
//   - components/card/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["heading", "heading-level", "href", "label"]);

export class Card extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > article.card")) return;

        const article = document.createElement("article");
        article.className = rootClassName(this, "card");
        const label = this.getAttribute("label");
        if (label !== null) article.setAttribute("aria-label", label);
        passThroughAttributes(this, article, HANDLED);

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
            article.appendChild(h);
        }

        moveChildrenInto(this, article);
        this.appendChild(article);
    }
}
