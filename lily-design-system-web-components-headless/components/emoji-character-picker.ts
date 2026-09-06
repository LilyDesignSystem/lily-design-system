// EmojiCharacterPicker component
//
// A passive <div role="grid"> container for browsing and selecting
// emoji characters. The custom element stands in for the wrapper div
// directly (see lib/dom-utils.applySelfClassName) since <div> has no
// native behaviour worth preserving as a separate element. The consumer
// supplies the grid rows/cells and implements selection behaviour and
// category filtering; this component contributes only the container
// semantics and the accessible name.
//
// Attributes:
//   label — REQUIRED. Accessible name describing the picker, via
//     aria-label.
//
// Keyboard: none — this is a passive element; the consumer implements
// grid keyboard navigation (arrow keys, Enter/Space).
//
// References:
//   - components/emoji-character-picker/index.md (canonical contract)
//   - WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/

import { applySelfClassName } from "../lib/dom-utils.js";

export class EmojiCharacterPicker extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "emoji-character-picker");
        this.setAttribute("role", "grid");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
    }
}
