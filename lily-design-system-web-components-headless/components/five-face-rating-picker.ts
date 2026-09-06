// FiveFaceRatingPicker component
//
// A passive <div role="radiogroup"> container for a 1-5 satisfaction
// rating using face labels. The custom element stands in for the
// wrapper div directly (see lib/dom-utils.applySelfClassName) since
// <div> has no native behaviour worth preserving as a separate element.
//
// DEVIATION FROM ONE READING OF THE CANONICAL CONTRACT (flagged, not
// hidden): components/five-face-rating-picker/AGENTS.md's "Key
// Behaviors" describes a self-built `<fieldset>` containing 5
// `<label>`/`<input type="radio">` pairs generated internally from a
// `labels` prop — matching the react/svelte/vue ports, which have
// built-in reactive state and self-generate the radio inputs. The
// blazor and nunjucks ports (the two other catalogs with no framework
// reactivity, the same category this Web Components catalog belongs
// to) instead implement the Picker as a PASSIVE labelled radiogroup
// container whose radio-equivalent children are separate
// FiveFaceRatingPickerButton instances the CONSUMER composes in — which
// is also exactly what this component's own "Composition: Children:
// five-face-rating-picker-button" note says, and avoids inventing
// un-documented internal label-generation logic (the AGENTS.md Props
// list has no `children` prop, but also no self-rendering support
// beyond what Key Behaviors describes for the reactive-framework
// ports). This implementation follows the blazor/nunjucks shape:
// consumer-supplied FiveFaceRatingPickerButton children, untouched.
//
// Attributes:
//   label — REQUIRED. Accessible name for the rating group, via
//     aria-label.
//
// Keyboard: none built in — native <button> focus/activation on the
// consumer-supplied FiveFaceRatingPickerButton children handles
// Tab/Enter/Space; this container adds no keydown handling of its own.
//
// References:
//   - components/five-face-rating-picker/index.md (canonical contract)
//   - WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radiobutton/

import { applySelfClassName } from "../lib/dom-utils.js";

export class FiveFaceRatingPicker extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "five-face-rating-picker");
        this.setAttribute("role", "radiogroup");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
    }
}
