// CareCard component
//
// A medical care instruction card with urgency levels (NHS England
// inspired). Renders a <section role="region"> landmark with an <h2>
// heading and body content.
//
// Deviation from the canonical AGENTS.md "HTML tag" metadata field (which
// says <div>): the real implementation in react-headless (and matched by
// html-headless's `<div role="region">`, which is the same landmark
// semantics on a less-specific element) renders a <section>. Followed
// headless.md's "most specific semantic element" rule and the react
// implementation.
//
// Attributes:
//   type — "non-urgent" | "urgent" | "immediate", default "non-urgent".
//     Exposed as data-type.
//   heading — REQUIRED. Heading text, rendered in an <h2>.
//   label — optional. aria-label override; defaults to the heading text.
//
// References:
//   - components/care-card/index.md (canonical contract)
//   - NHS England Care Cards: https://service-manual.nhs.uk/design-system/components/care-cards

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["type", "heading", "label"]);

export class CareCard extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > section.care-card")) return;

        const section = document.createElement("section");
        section.className = rootClassName(this, "care-card");
        section.setAttribute("role", "region");
        const heading = this.getAttribute("heading") ?? "";
        const label = this.getAttribute("label");
        section.setAttribute("aria-label", label ?? heading);
        section.setAttribute("data-type", this.getAttribute("type") ?? "non-urgent");
        passThroughAttributes(this, section, HANDLED);

        const h2 = document.createElement("h2");
        h2.textContent = heading;
        section.appendChild(h2);

        moveChildrenInto(this, section);
        this.appendChild(section);
    }
}
