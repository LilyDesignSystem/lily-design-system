// Container component
//
// A generic block-level content container: a plain <div> with no ARIA
// role and no behaviour. The custom element stands in for the wrapper
// div directly (see lib/dom-utils.applySelfClassName).
//
// Attributes: none beyond the base class + rest-props (the host already
// carries whatever the consumer wrote).
//
// References:
//   - components/container/index.md (canonical contract)

import { applySelfClassName } from "../lib/dom-utils.js";

export class Container extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "container");
    }
}
