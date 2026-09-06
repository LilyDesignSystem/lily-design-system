// ChatMessage component
//
// One chat conversation message entry: an <article> for self-contained
// message semantics (author avatar, author name, time, content are all
// consumer-supplied children).
//
// Attributes:
//   label — optional. Accessible description of the message, via aria-label.
//   ...rest — spread onto the <article>.
//
// References:
//   - components/chat-message/index.md (canonical contract)
//   - MDN HTML article element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class ChatMessage extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > article.chat-message")) return;

        const article = document.createElement("article");
        article.className = rootClassName(this, "chat-message");
        const label = this.getAttribute("label");
        if (label !== null) article.setAttribute("aria-label", label);
        passThroughAttributes(this, article, HANDLED);

        moveChildrenInto(this, article);
        this.appendChild(article);
    }
}
