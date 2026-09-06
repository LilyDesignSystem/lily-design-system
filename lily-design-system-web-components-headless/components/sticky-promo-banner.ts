// StickyPromoBanner component
//
// A native <aside role="complementary"> fixed-position promotional banner
// with an optional dismiss button. Wraps a generated <aside> (pattern 1)
// since `<aside>` is a real element worth rendering for real.
//
// Attributes:
//   label — REQUIRED. Accessible name for the aside landmark, via
//     aria-label.
//   open — "true" | "false", default true (absent = true). When "false",
//     the rendered aside carries the `hidden` attribute.
//   position — "top" | "bottom", default "bottom". Exposed as
//     data-position; the consumer's own CSS supplies the actual
//     `position: fixed; top: 0;`/`bottom: 0;` declaration keyed off that
//     attribute — no inline style is set here (this catalog sanctions only
//     two named inline-style exceptions, FloatButton and ThemeProvider,
//     plus CSS custom properties; direct fixed-positioning styles are
//     neither).
//   dismissible — presence-based boolean; renders a dismiss button.
//   dismiss-label — accessible name for the dismiss button, via aria-label.
//
// Fires a bubbling, composed "lily-close" CustomEvent when dismissed, then
// sets `open="false"`.
//
// References:
//   - components/sticky-promo-banner/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "open", "position", "dismissible", "dismiss-label"]);

export class StickyPromoBanner extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["open", "position", "label"];
    }

    #aside: HTMLElement | null = null;

    connectedCallback(): void {
        if (this.#aside) {
            this.#sync();
            return;
        }

        const aside = document.createElement("aside");
        aside.className = rootClassName(this, "sticky-promo-banner");
        aside.setAttribute("role", "complementary");
        passThroughAttributes(this, aside, HANDLED);

        const content = document.createElement("div");
        content.className = "sticky-promo-banner-content";
        moveChildrenInto(this, content);
        aside.appendChild(content);

        if (this.hasAttribute("dismissible")) {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "sticky-promo-banner-dismiss";
            const dismissLabel = this.getAttribute("dismiss-label");
            if (dismissLabel !== null) button.setAttribute("aria-label", dismissLabel);
            button.addEventListener("click", this.#onDismiss);
            aside.appendChild(button);
        }

        this.appendChild(aside);
        this.#aside = aside;
        this.#sync();
    }

    attributeChangedCallback(): void {
        this.#sync();
    }

    #sync(): void {
        const aside = this.#aside;
        if (!aside) return;

        const label = this.getAttribute("label");
        if (label !== null) aside.setAttribute("aria-label", label);

        const position = this.getAttribute("position") === "top" ? "top" : "bottom";
        aside.setAttribute("data-position", position);

        aside.hidden = this.getAttribute("open") === "false";
    }

    #onDismiss = (): void => {
        this.dispatchEvent(new CustomEvent("lily-close", { bubbles: true, composed: true }));
        this.setAttribute("open", "false");
    };
}
