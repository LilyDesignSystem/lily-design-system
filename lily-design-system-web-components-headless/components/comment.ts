// Comment component
//
// A <div> for a single comment — anything expressing an opinion,
// observation, or explanation. The custom element stands in for the
// wrapper div directly (see lib/dom-utils.applySelfClassName) since
// <div> has no native behaviour worth preserving as a separate element.
// The consumer's own light-DOM children (avatar, author, timestamp,
// body, nested replies, …) stay exactly where they are.
//
// Attributes:
//   label — optional. Accessible label for the comment, via aria-label.
//
// References:
//   - components/comment/index.md (canonical contract)

import { applySelfClassName } from "../lib/dom-utils.js";

export class Comment extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "comment");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
    }
}
