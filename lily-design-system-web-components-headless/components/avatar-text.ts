// AvatarText component
//
// The text/initials fallback within an Avatar. Renders a
// <span aria-hidden="true"> containing the initials or short text that
// represents the user when no image is available. Must be used inside an
// Avatar container — aria-hidden prevents duplicate announcements since
// the parent Avatar already carries an aria-label.
//
// No attributes beyond the shared class hook.
//
// References:
//   - components/avatar-text/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set<string>();

export class AvatarText extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > span.avatar-text")) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "avatar-text");
        span.setAttribute("aria-hidden", "true");
        passThroughAttributes(this, span, HANDLED);

        moveChildrenInto(this, span);
        this.appendChild(span);
    }
}
