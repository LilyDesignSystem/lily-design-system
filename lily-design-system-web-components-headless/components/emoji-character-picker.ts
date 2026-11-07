// EmojiCharacterPicker component
//
// A passive <div role="group"> container for browsing and selecting
// emoji characters. The custom element stands in for the wrapper div
// directly (see lib/dom-utils.applySelfClassName) since <div> has no
// native behaviour worth preserving as a separate element. The consumer
// supplies the emoji buttons and implements selection behaviour and
// category filtering; this component contributes only the container
// semantics and the accessible name.
//
// Attributes:
//   label — REQUIRED. Accessible name describing the picker, via
//     aria-label.
//
// Keyboard: the buttons' own: Tab moves between them, Enter or Space
// chooses one.
//
// References:
//   - components/emoji-character-picker/index.md (canonical contract)
//   - WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group

import { applySelfClassName } from "../lib/dom-utils.js";

export class EmojiCharacterPicker extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "emoji-character-picker");
        this.setAttribute("role", "group");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
    }
}
