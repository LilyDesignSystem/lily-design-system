// FiveStarRatingPicker component
//
// A passive <div role="radiogroup"> container for a 1-5 star rating.
// The custom element stands in for the wrapper div directly (see
// lib/dom-utils.applySelfClassName) since <div> has no native
// behaviour worth preserving as a separate element.
//
// DEVIATION FROM ONE READING OF THE CANONICAL CONTRACT (flagged, not
// hidden): see five-face-rating-picker.ts's header for the full
// reasoning — this component follows the same blazor/nunjucks-shaped
// passive-radiogroup pattern (consumer-supplied
// FiveStarRatingPickerButton children) rather than the react/svelte/vue
// ports' self-built `<fieldset>` + generated radio inputs, since this
// catalog has no framework reactivity to drive that self-generation and
// the component's own "Composition: Children:
// five-star-rating-picker-button" note already documents this shape.
//
// Attributes:
//   label — REQUIRED. Accessible name for the rating group, via
//     aria-label.
//
// Keyboard: none built in — native <button> focus/activation on the
// consumer-supplied FiveStarRatingPickerButton children handles
// Tab/Enter/Space; this container adds no keydown handling of its own.
//
// References:
//   - components/five-star-rating-picker/index.md (canonical contract)
//   - WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radiobutton/

import { applySelfClassName } from "../lib/dom-utils.js";

export class FiveStarRatingPicker extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "five-star-rating-picker");
        this.setAttribute("role", "radiogroup");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
    }
}
