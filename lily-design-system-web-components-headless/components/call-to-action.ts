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
import { setOrRemove } from "../lib/live-element.js";

const HANDLED = new Set(["href", "label", "disabled"]);

export class CallToAction extends HTMLElement {
    // A change to href, label, disabled or class is shown (tasks.md P50-T28): gaining or losing href turns it into a link or a
    // button, holding the same content.
    static get observedAttributes(): string[] {
        return [...HANDLED, "class"];
    }

    attributeChangedCallback(): void {
        let el = this.querySelector<HTMLElement>(
            ":scope > a.call-to-action, :scope > button.call-to-action",
        );
        if (!el) return;
        const href = this.getAttribute("href");
        const tag = href !== null ? "A" : "BUTTON";
        if (el.tagName !== tag) {
            const next = document.createElement(tag);
            for (const { name, value } of Array.from(el.attributes))
                if (!["href", "type", "disabled"].includes(name)) next.setAttribute(name, value);
            next.append(...el.childNodes);
            el.replaceWith(next);
            el = next;
        }
        el.className = rootClassName(this, "call-to-action");
        if (el instanceof HTMLAnchorElement) el.href = href ?? "";
        else if (el instanceof HTMLButtonElement) {
            el.type = "button";
            el.disabled = this.hasAttribute("disabled");
        }
        setOrRemove(el, "aria-label", this.getAttribute("label"));
    }

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
