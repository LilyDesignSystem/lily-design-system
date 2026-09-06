// ErrorSummary component
//
// A consolidated list of form validation errors, following the GOV.UK /
// NHS England error summary pattern: a <div role="alert"> labelled by
// its own heading, focusable programmatically (but not via Tab) so the
// consumer can move focus there after a failed submission. The custom
// element stands in for the wrapper div directly (see
// lib/dom-utils.applySelfClassName).
//
// Attributes:
//   title — REQUIRED. Heading text (e.g. "There is a problem"),
//     rendered in an <h2>.
//
// The consumer's children (typically a <ul> of linked errors) are moved
// after the heading, once, at connect time.
//
// References:
//   - components/error-summary/index.md (canonical contract)
//   - GOV.UK Error Summary: https://design-system.service.gov.uk/components/error-summary/
//   - WAI-ARIA Alert Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/alert/

import { applySelfClassName, nextId } from "../lib/dom-utils.js";

export class ErrorSummary extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        const titleId = nextId("lily-error-summary-title");
        const heading = document.createElement("h2");
        heading.id = titleId;
        heading.textContent = this.getAttribute("title") ?? "";

        // Insert the heading before the consumer's existing content (e.g.
        // a <ul> of error links), which stays exactly where it is.
        this.insertBefore(heading, this.firstChild);

        applySelfClassName(this, "error-summary");
        this.setAttribute("role", "alert");
        this.setAttribute("aria-labelledby", titleId);
        this.tabIndex = -1;
    }
}
