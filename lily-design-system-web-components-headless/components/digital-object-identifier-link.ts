// DigitalObjectIdentifierLink component
//
// A permanent hyperlink for a Digital Object Identifier (DOI) to an
// electronic source. Constructs the href from the DOI using the
// https://doi.org/ resolver prefix.
//
// Attributes:
//   doi — REQUIRED. The Digital Object Identifier (e.g. "10.1000/xyz123").
//   ...rest — spread onto the <a> (e.g. aria-label for extra context).
//
// Children:
//   Optional display text; defaults to the bare DOI string when omitted.
//
// References:
//   - components/digital-object-identifier-link/index.md (canonical contract)
//   - DOI Handbook: https://www.doi.org/hb.html

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["doi"]);

export class DigitalObjectIdentifierLink extends HTMLElement {
    #doi: string | null = null;

    // A change to doi or class is shown (tasks.md P50-T28).
    static get observedAttributes(): string[] {
        return ["doi", "class"];
    }

    attributeChangedCallback(): void {
        const el = this.querySelector<HTMLAnchorElement>(
            ":scope > a.digital-object-identifier-link",
        );
        if (!el) return;
        el.className = rootClassName(this, "digital-object-identifier-link");
        const doi = this.getAttribute("doi");
        // The text is the DOI only when the consumer gave none; their own text stays.
        const shown = el.textContent === this.#doi;
        if (doi !== null) el.href = `https://doi.org/${doi}`;
        else el.removeAttribute("href");
        if (shown) el.textContent = doi ?? "";
        this.#doi = doi;
    }

    connectedCallback(): void {
        if (this.querySelector(":scope > a.digital-object-identifier-link")) return;

        const doi = this.getAttribute("doi");

        const a = document.createElement("a");
        a.className = rootClassName(this, "digital-object-identifier-link");
        if (doi !== null) a.href = `https://doi.org/${doi}`;
        a.setAttribute("rel", "noopener noreferrer");
        passThroughAttributes(this, a, HANDLED);

        moveChildrenInto(this, a);
        if (!a.hasChildNodes() && doi !== null) {
            a.textContent = doi;
            this.#doi = doi;
        }

        this.appendChild(a);
    }
}
