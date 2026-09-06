// InsetText component
//
// A <div role="note"> block distinguishing indented content from
// surrounding text (GOV.UK / NHS England "inset text" pattern). The
// custom element stands in for the wrapper div directly (see
// lib/dom-utils.applySelfClassName).
//
// Attributes: none beyond the base class + rest-props (already present
// on the host).
//
// References:
//   - components/inset-text/index.md (canonical contract)
//   - WAI-ARIA Note Role: https://www.w3.org/TR/wai-aria-1.2/#note
//   - GOV.UK Inset Text: https://design-system.service.gov.uk/components/inset-text/
//   - NHS England Inset Text: https://service-manual.nhs.uk/design-system/components/inset-text

import { applySelfClassName } from "../lib/dom-utils.js";

export class InsetText extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "inset-text");
        this.setAttribute("role", "note");
    }
}
