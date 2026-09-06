// Avatar component
//
// An avatar container that displays a user's identity, rendered as
// <span role="img"> with an accessible label. The consumer provides
// AvatarImage and/or AvatarText children.
//
// Deviation from the canonical AGENTS.md "HTML tag" metadata field (which
// says <div>): the real implementation in svelte-headless, react-headless,
// and vue-headless all render a <span role="img">; only html-headless's
// minimal demo uses a bare <div>. Followed the 3-catalog majority.
//
// Attributes:
//   alt — REQUIRED. Accessible description of the person, via aria-label.
//
// References:
//   - components/avatar/index.md (canonical contract)
//   - WAI-ARIA img role: https://www.w3.org/TR/wai-aria-1.2/#img

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["alt"]);

export class Avatar extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > span.avatar")) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "avatar");
        span.setAttribute("role", "img");
        const alt = this.getAttribute("alt");
        if (alt !== null) span.setAttribute("aria-label", alt);
        passThroughAttributes(this, span, HANDLED);

        moveChildrenInto(this, span);
        this.appendChild(span);
    }
}
