// ChatNav component
//
// A navigation container for chat information: a <nav> landmark wrapping
// ChatList/ChatListItem (each typically containing a ChatMessage).
//
// Attributes:
//   label — REQUIRED. Accessible name for the navigation landmark, via
//     aria-label.
//   ...rest — spread onto the <nav>.
//
// Deviation: the canonical AGENTS.md marks this "Interactive: yes" and
// describes consumer-level Tab/Enter/Arrow behaviour on the chat list
// items, but every real cross-catalog implementation (svelte, react, vue,
// blazor, nunjucks) renders a plain, passive <nav aria-label> with no
// keydown handling of its own — the described interactivity belongs to
// ChatListItem/ChatList children, not this landmark wrapper. Followed the
// real, unanimous cross-catalog contract.
//
// References:
//   - components/chat-nav/index.md (canonical contract)
//   - WAI-ARIA Navigation Landmark: https://www.w3.org/WAI/ARIA/apg/patterns/landmark/

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class ChatNav extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > nav.chat-nav")) return;

        const nav = document.createElement("nav");
        nav.className = rootClassName(this, "chat-nav");
        const label = this.getAttribute("label");
        if (label !== null) nav.setAttribute("aria-label", label);
        passThroughAttributes(this, nav, HANDLED);

        moveChildrenInto(this, nav);
        this.appendChild(nav);
    }
}
