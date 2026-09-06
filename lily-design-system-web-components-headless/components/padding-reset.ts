// PaddingReset component
//
// A structural <div> that resets horizontal padding so content can break
// out of a padded fluid-width container. The custom element stands in
// for the wrapper div directly (see lib/dom-utils.applySelfClassName).
// Purely presentational — the negative-margin mechanics live in consumer
// CSS. Inspired by Reuters Graphics' PaddingReset component.
//
// No attributes beyond the class hook and pass-through rest attributes,
// which stay on the host since it is itself the rendered element.
//
// References:
//   - components/padding-reset/index.md (canonical contract)

import { applySelfClassName } from "../lib/dom-utils.js";

export class PaddingReset extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "padding-reset");
    }
}
