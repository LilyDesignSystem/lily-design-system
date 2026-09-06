// ChatList component
//
// An ordered list of ChatListItem components, typically each containing a
// ChatMessage, within a ChatNav.
//
// Attributes:
//   label — optional. Accessible name, via aria-label.
//   ...rest — spread onto the <ol>.
//
// References:
//   - components/chat-list/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class ChatList extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > ol.chat-list")) return;

        const ol = document.createElement("ol");
        ol.className = rootClassName(this, "chat-list");
        const label = this.getAttribute("label");
        if (label !== null) ol.setAttribute("aria-label", label);
        passThroughAttributes(this, ol, HANDLED);

        moveChildrenInto(this, ol);
        this.appendChild(ol);
    }
}
