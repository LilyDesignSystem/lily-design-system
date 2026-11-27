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

import { applySelfClassName, followSelf } from "../lib/dom-utils.js";

export class PaddingReset extends HTMLElement {
    #built = false;

    // A change to class is shown (tasks.md P50-T28); the content is the consumer's children.
    static get observedAttributes(): string[] {
        return ["class"];
    }

    attributeChangedCallback(name: string): void {
        if (this.#built) followSelf(this, "padding-reset", name);
    }

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "padding-reset");
    }
}
