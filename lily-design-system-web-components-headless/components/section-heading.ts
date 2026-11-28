// SectionHeading component
//
// A <header> introducing a major content section: an optional eyebrow
// above the heading, the required heading itself (level 2-6), and an
// optional subtitle below. Purely passive — no JavaScript behaviour.
//
// Attributes:
//   heading — REQUIRED. Main heading text.
//   eyebrow — optional. Rendered in <p class="section-heading-eyebrow">
//     above the heading.
//   subtitle — optional. Rendered in <p class="section-heading-subtitle">
//     below the heading.
//   level — "2" | "3" | "4" | "5" | "6", default "2".
//
// References:
//   - components/section-heading/index.md (canonical contract)

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["heading", "eyebrow", "subtitle", "level"]);

export class SectionHeading extends HTMLElement {
    // A change to heading, eyebrow, subtitle, level or class is shown (tasks.md P50-T28): everything inside is built from the
    // attributes, so it is built again.
    static get observedAttributes(): string[] {
        return [...HANDLED, "class"];
    }

    attributeChangedCallback(): void {
        const header = this.querySelector<HTMLElement>(":scope > header.section-heading");
        if (!header) return;
        header.className = rootClassName(this, "section-heading");
        header.replaceChildren();
        this.#fill(header);
    }

    connectedCallback(): void {
        if (this.querySelector(":scope > header.section-heading")) return;

        const header = document.createElement("header");
        header.className = rootClassName(this, "section-heading");
        passThroughAttributes(this, header, HANDLED);
        this.#fill(header);
        this.appendChild(header);
    }

    #fill(header: HTMLElement): void {
        const eyebrow = this.getAttribute("eyebrow");
        if (eyebrow !== null) {
            const p = document.createElement("p");
            p.className = "section-heading-eyebrow";
            p.textContent = eyebrow;
            header.appendChild(p);
        }

        const level = this.getAttribute("level") ?? "2";
        const h = document.createElement(`h${level}`);
        h.className = "section-heading-heading";
        h.textContent = this.getAttribute("heading") ?? "";
        header.appendChild(h);

        const subtitle = this.getAttribute("subtitle");
        if (subtitle !== null) {
            const p = document.createElement("p");
            p.className = "section-heading-subtitle";
            p.textContent = subtitle;
            header.appendChild(p);
        }
    }
}
