// GovernmentIdentifier component
//
// An identifier section naming the parent agency of a government website:
// a <section> landmark with an optional logo, the REQUIRED agency name, an
// optional description, and a nested <nav> of required links (the
// consumer's children). Inspired by the USWDS Identifier component.
//
// Attributes:
//   label — REQUIRED. Accessible name for the section (and, matching the
//     canonical contract, reused as the inner nav's aria-label too).
//   agency-name — REQUIRED. Parent agency name.
//   agency-href — optional. When present, the agency name is wrapped in an
//     <a>; otherwise a <span>.
//   logo-url — optional. When present, renders an <img class="government-identifier-logo">.
//   logo-alt — optional, default "".
//   description — optional. Rendered in <p class="government-identifier-description">.
//   ...rest — spread onto the <section>.
//
// The nested <nav class="government-identifier-links"> is rendered only
// when the consumer supplied children (the required-links list), matching
// the canonical contract's `{#if children}` guard.
//
// References:
//   - components/government-identifier/index.md (canonical contract)
//   - US Web Design System Identifier: https://designsystem.digital.gov/components/identifier/
//   - WAI-ARIA region role: https://www.w3.org/TR/wai-aria-1.2/#region

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "agency-name", "agency-href", "logo-url", "logo-alt", "description"]);

export class GovernmentIdentifier extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > section.government-identifier")) return;

        const hasChildren = this.childNodes.length > 0;

        const section = document.createElement("section");
        section.className = rootClassName(this, "government-identifier");
        const label = this.getAttribute("label") ?? "";
        section.setAttribute("aria-label", label);
        passThroughAttributes(this, section, HANDLED);

        const masthead = document.createElement("div");
        masthead.className = "government-identifier-masthead";

        const logoUrl = this.getAttribute("logo-url");
        if (logoUrl !== null) {
            const img = document.createElement("img");
            img.className = "government-identifier-logo";
            img.src = logoUrl;
            img.alt = this.getAttribute("logo-alt") ?? "";
            masthead.appendChild(img);
        }

        const agency = document.createElement("p");
        agency.className = "government-identifier-agency";
        const agencyName = this.getAttribute("agency-name") ?? "";
        const agencyHref = this.getAttribute("agency-href");
        if (agencyHref !== null) {
            const a = document.createElement("a");
            a.href = agencyHref;
            a.textContent = agencyName;
            agency.appendChild(a);
        } else {
            const span = document.createElement("span");
            span.textContent = agencyName;
            agency.appendChild(span);
        }
        masthead.appendChild(agency);

        const description = this.getAttribute("description");
        if (description !== null) {
            const p = document.createElement("p");
            p.className = "government-identifier-description";
            p.textContent = description;
            masthead.appendChild(p);
        }

        section.appendChild(masthead);

        if (hasChildren) {
            const nav = document.createElement("nav");
            nav.className = "government-identifier-links";
            nav.setAttribute("aria-label", label);
            moveChildrenInto(this, nav);
            section.appendChild(nav);
        }

        this.appendChild(section);
    }
}
