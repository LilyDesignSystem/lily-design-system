// Affix component
//
// A wrapper that pins its content to a viewport position while the page
// scrolls. A plain <div> — the custom element stands in for the wrapper div
// directly (see lib/dom-utils.applySelfClassName). Purely structural; no
// ARIA semantics.
//
// RESOLVED DEVIATION (was flagged during the 2026-09-06 batch as a
// candidate third inline-style exception): rather than setting `position`/
// `top`/`bottom` directly, this component sets only CSS custom properties
// (`--affix-offset-top`, `--affix-offset-bottom`) via inline style — a
// form already pre-sanctioned by AGENTS/headless.md ("CSS custom
// properties applied as variables"), so it does not need a new named
// exception the way FloatButton's `position: fixed` and ThemeProvider's
// `display: contents` did. The actual `position: sticky` declaration
// belongs in the consumer's own stylesheet, targeting the `.affix` class
// hook, exactly like every other visual decision in this catalog:
//   .affix { position: sticky; top: var(--affix-offset-top, 0); }
// `data-offset-top`/`data-offset-bottom` are kept too, for a consumer who
// prefers reading the raw attribute over the CSS variable.
//
// Attributes:
//   offset-top — number (px), optional.
//   offset-bottom — number (px), optional.
//   ...rest — spread onto `this` (the host is the rendered element).
//
// References:
//   - components/affix/index.md (canonical contract)
//   - MDN position: sticky: https://developer.mozilla.org/docs/Web/CSS/position#sticky

import { applySelfClassName } from "../lib/dom-utils.js";

export class Affix extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["offset-top", "offset-bottom"];
    }

    #built = false;

    connectedCallback(): void {
        if (!this.#built) {
            this.#built = true;
            applySelfClassName(this, "affix");
        }
        this.#sync();
    }

    attributeChangedCallback(): void {
        this.#sync();
    }

    #sync(): void {
        if (!this.#built) return;
        const offsetTop = this.getAttribute("offset-top");
        const offsetBottom = this.getAttribute("offset-bottom");

        if (offsetTop !== null) {
            this.style.setProperty("--affix-offset-top", `${offsetTop}px`);
            this.setAttribute("data-offset-top", offsetTop);
        } else {
            this.style.setProperty("--affix-offset-top", "0px");
            this.removeAttribute("data-offset-top");
        }

        if (offsetBottom !== null) {
            this.style.setProperty("--affix-offset-bottom", `${offsetBottom}px`);
            this.setAttribute("data-offset-bottom", offsetBottom);
        } else {
            this.style.removeProperty("--affix-offset-bottom");
            this.removeAttribute("data-offset-bottom");
        }
    }
}
