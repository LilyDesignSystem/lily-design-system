// CallToAction component
//
// A prominent prompt encouraging user action. Renders as an <a> when
// `href` is provided (navigation CTAs), or a <button type="button">
// otherwise (action CTAs) — dual-mode, for correct semantic HTML.
//
// Deviation from the canonical AGENTS.md "HTML tag" metadata field (which
// says <div>): svelte-headless and react-headless both confirm the
// dual-mode <a>/<button> rendering with no wrapping div; html-headless's
// minimal demo (a bare aria-labelled div) is the outlier here. Followed
// the 2-of-3 majority and headless.md's "most specific semantic element"
// rule.
//
// Attributes:
//   href — optional. If present, renders as a link.
//   label — optional. aria-label override.
//   disabled — presence-based boolean; button mode only (links cannot be
//     natively disabled).
//
// Keyboard: Tab to focus; Enter activates either mode; Space activates
// button mode only (native behaviour, no JS needed).
//
// References:
//   - components/call-to-action/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["href", "label", "disabled"]);

export class CallToAction extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > a.call-to-action, :scope > button.call-to-action")) return;

        const href = this.getAttribute("href");
        const label = this.getAttribute("label");
        const el = document.createElement(href !== null ? "a" : "button");
        el.className = rootClassName(this, "call-to-action");
        if (href !== null) {
            (el as HTMLAnchorElement).href = href;
        } else {
            (el as HTMLButtonElement).type = "button";
            (el as HTMLButtonElement).disabled = this.hasAttribute("disabled");
        }
        if (label !== null) el.setAttribute("aria-label", label);
        passThroughAttributes(this, el, HANDLED);

        moveChildrenInto(this, el);
        this.appendChild(el);
    }
}
