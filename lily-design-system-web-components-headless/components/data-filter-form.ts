// DataFilterForm component
//
// A <form role="search"> for filtering data by criteria. Submission's
// default is prevented so the consumer can apply filters without a page
// navigation; the (still-dispatched, bubbling) "submit" event is the
// framework ports' onsubmit callback's equivalent. Reset is left fully
// native — no interception — matching the framework ports' onreset
// pass-through.
//
// Attributes:
//   label — REQUIRED. Accessible name for the search region, via
//     aria-label.
//   ...rest — spread onto the <form>.
//
// References:
//   - components/data-filter-form/index.md (canonical contract)
//   - ARIA search role: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/search_role

import {
    moveChildrenInto,
    passThroughAttributes,
    rootClassName,
    followLabel,
} from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class DataFilterForm extends HTMLElement {
    // A change to label or class is shown (tasks.md P50-T28); the content is the consumer's children.
    static get observedAttributes(): string[] {
        return ["label", "class"];
    }

    attributeChangedCallback(): void {
        followLabel(this, "form.data-filter-form", "data-filter-form");
    }

    connectedCallback(): void {
        if (this.querySelector(":scope > form.data-filter-form")) return;

        const form = document.createElement("form");
        form.className = rootClassName(this, "data-filter-form");
        form.setAttribute("role", "search");
        const label = this.getAttribute("label");
        if (label !== null) form.setAttribute("aria-label", label);
        passThroughAttributes(this, form, HANDLED);
        form.addEventListener("submit", (event) => event.preventDefault());

        moveChildrenInto(this, form);
        this.appendChild(form);
    }
}
