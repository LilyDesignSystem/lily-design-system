// Card component
//
// A <div> grouping one card's content (role="group" when labelled), with an
// optional heading (levels 2–6) that becomes a link when `href` is supplied.
//
// Attributes:
//   heading — optional heading text.
//   heading-level — "2" | "3" | "4" | "5" | "6", default "3".
//   href — optional; wraps the heading text in an <a>.
//   whole-card-link — boolean attribute; with href, marks the heading link data-lily-card-link, so the themes make
//     the whole card its target.
//   label — optional; names the card, which then has role="group".
//
// References:
//   - components/card/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["heading", "heading-level", "href", "label", "whole-card-link"]);

export class Card extends HTMLElement {
    // The heading this element built, the first child of the root; the consumer's content follows it.
    #heading: HTMLElement | null = null;

    // A change to heading, heading-level, href, whole-card-link, label or class is shown (tasks.md P50-T28): the heading is built
    // again in place, and the consumer's content is left alone.
    static get observedAttributes(): string[] {
        return [...HANDLED, "class"];
    }

    attributeChangedCallback(): void {
        const root = this.querySelector<HTMLElement>(":scope > div.card");
        if (!root) return;
        this.#name(root);
        const next = this.#buildHeading();
        if (this.#heading && next) this.#heading.replaceWith(next);
        else if (this.#heading) this.#heading.remove();
        else if (next) root.prepend(next);
        this.#heading = next;
    }

    connectedCallback(): void {
        if (this.querySelector(":scope > div.card")) return;

        const root = document.createElement("div");
        this.#name(root);
        passThroughAttributes(this, root, HANDLED);

        this.#heading = this.#buildHeading();
        if (this.#heading) root.appendChild(this.#heading);

        moveChildrenInto(this, root);
        this.appendChild(root);
    }

    #name(root: HTMLElement): void {
        root.className = rootClassName(this, "card");
        const label = this.getAttribute("label");
        if (label) {
            root.setAttribute("role", "group");
            root.setAttribute("aria-label", label);
        } else {
            root.removeAttribute("role");
            root.removeAttribute("aria-label");
        }
    }

    #buildHeading(): HTMLElement | null {
        const heading = this.getAttribute("heading");
        if (heading === null) return null;
        const level = this.getAttribute("heading-level") ?? "3";
        const h = document.createElement(`h${level}`);
        const href = this.getAttribute("href");
        if (href !== null) {
            const a = document.createElement("a");
            a.href = href;
            if (this.hasAttribute("whole-card-link")) a.setAttribute("data-lily-card-link", "");
            a.textContent = heading;
            h.appendChild(a);
        } else {
            h.textContent = heading;
        }
        return h;
    }
}
