// NetPromoterScorePicker component
//
// A passive <div role="radiogroup"> container for a 0-10 Net Promoter
// Score rating. The custom element stands in for the wrapper div
// directly (see lib/dom-utils.applySelfClassName) since <div> has no
// native behaviour worth preserving as a separate element.
//
// DEVIATION FROM ONE READING OF THE CANONICAL CONTRACT (flagged, not
// hidden): see five-face-rating-picker.ts's header for the full
// reasoning — this component follows the same blazor/nunjucks-shaped
// passive-radiogroup pattern (consumer-supplied
// NetPromoterScorePickerButton children) rather than the react/svelte/vue
// ports' self-built `<fieldset>` + 11 generated radio inputs, since this
// catalog has no framework reactivity to drive that self-generation and
// the component's own "Composition: Children:
// net-promoter-score-picker-button" note already documents this shape.
//
// Attributes:
//   label — REQUIRED. Accessible label for the radiogroup, via
//     aria-label.
//
// Keyboard: the APG radio group (attachRadioGroup): one tab stop, on the checked
// button, and the arrows move, check and wrap, swapped in right-to-left.
//
// References:
//   - components/net-promoter-score-picker/index.md (canonical contract)
//   - Net Promoter Score: https://en.wikipedia.org/wiki/Net_promoter_score
//   - WAI-ARIA Radiogroup Role: https://www.w3.org/TR/wai-aria-1.2/#radiogroup

import { applySelfClassName } from "../lib/dom-utils.js";
import { attachRadioGroup } from "../lib/widget-keys.js";

export class NetPromoterScorePicker extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "net-promoter-score-picker");
        this.setAttribute("role", "radiogroup");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
        // The buttons build themselves in their own connectedCallback, after this one, so attach once they exist.
        queueMicrotask(() => attachRadioGroup(this));
    }
}
