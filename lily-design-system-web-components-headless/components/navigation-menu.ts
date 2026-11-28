// NavigationMenu component
//
// A site-wide navigation menu with links. Renders a native <nav>, which
// implicitly carries the navigation landmark role.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label, distinguishing this
//     nav landmark from others on the page.
//   overflow — optional boolean attribute. Overflow mode: the children must be
//     <li> items; they are placed in <ul class="navigation-menu-list"> beside a
//     hidden "More" item, and a ResizeObserver moves the items that do not fit
//     into a disclosure. Publishes data-overflow="true" on the nav. Without
//     JavaScript the links simply wrap. The set of items must not change while
//     the element is connected.
//   more-label — REQUIRED with overflow. The More button's accessible name.
//
// Keyboard (overflow mode): Enter / Space toggle the More button; Escape closes
// the list and returns focus to the button; a click outside closes it.
//
// References:
//   - components/navigation-menu/index.md (canonical contract)
//   - WAI-ARIA Navigation Landmark: https://www.w3.org/TR/wai-aria-1.2/#navigation

import {
    hasBooleanAttr,
    moveChildrenInto,
    passThroughAttributes,
    rootClassName,
} from "../lib/dom-utils.js";
import { setupOverflowNavigation, type OverflowNavigation } from "../lib/overflow-navigation.js";

const HANDLED = new Set(["label", "overflow", "more-label"]);

export class NavigationMenu extends HTMLElement {
    private overflowHandle: OverflowNavigation | null = null;

    // A change to label, more-label or class is shown (tasks.md P50-T28). overflow decides the element's structure (a list with a
    // "More" item, or the consumer's own content), so it is read once, when the element is built.
    static get observedAttributes(): string[] {
        return ["label", "more-label", "class"];
    }

    attributeChangedCallback(): void {
        const nav = this.querySelector<HTMLElement>(":scope > nav.navigation-menu");
        if (!nav) return;
        nav.className = rootClassName(this, "navigation-menu");
        const label = this.getAttribute("label");
        if (label !== null) nav.setAttribute("aria-label", label);
        else nav.removeAttribute("aria-label");
        const more = nav.querySelector(".navigation-menu-more-button");
        if (more) more.textContent = this.getAttribute("more-label") ?? "";
    }

    connectedCallback(): void {
        const existing = this.querySelector<HTMLElement>(":scope > nav.navigation-menu");
        if (existing) {
            if (hasBooleanAttr(this, "overflow") && !this.overflowHandle) {
                this.overflowHandle = setupOverflowNavigation(existing);
            }
            return;
        }

        const nav = document.createElement("nav");
        nav.className = rootClassName(this, "navigation-menu");
        const label = this.getAttribute("label");
        if (label !== null) nav.setAttribute("aria-label", label);
        passThroughAttributes(this, nav, HANDLED);

        if (hasBooleanAttr(this, "overflow")) {
            nav.setAttribute("data-overflow", "true");
            const list = document.createElement("ul");
            list.className = "navigation-menu-list";
            moveChildrenInto(this, list);
            const more = document.createElement("li");
            more.className = "navigation-menu-more";
            more.hidden = true;
            const button = document.createElement("button");
            button.className = "navigation-menu-more-button";
            button.type = "button";
            button.setAttribute("aria-expanded", "false");
            button.textContent = this.getAttribute("more-label") ?? "";
            const moreList = document.createElement("ul");
            moreList.className = "navigation-menu-more-list";
            moreList.hidden = true;
            more.append(button, moreList);
            list.appendChild(more);
            nav.appendChild(list);
            this.appendChild(nav);
            this.overflowHandle = setupOverflowNavigation(nav);
            return;
        }

        moveChildrenInto(this, nav);
        this.appendChild(nav);
    }

    disconnectedCallback(): void {
        this.overflowHandle?.dispose();
        this.overflowHandle = null;
    }
}
