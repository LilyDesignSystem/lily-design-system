// TabBarButton component
//
// One tab button within a TabBar's `role="tablist"`. Renders a native
// <button role="tab"> with roving tabindex (0 when selected, -1
// otherwise).
//
// Attributes:
//   selected — presence-based boolean; whether this tab is active.
//   controls — REQUIRED. Id of the associated tabpanel, via aria-controls.
//
// References:
//   - components/tab-bar-button/index.md (canonical contract)
//   - WAI-ARIA Tab Role: https://www.w3.org/TR/wai-aria-1.2/#tab

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";
import { setOrRemove } from "../lib/live-element.js";

const HANDLED = new Set(["selected", "controls"]);

export class TabBarButton extends HTMLElement {
    // A change to selected, controls or class is shown (tasks.md P50-T28).
    static get observedAttributes(): string[] {
        return ["selected", "controls", "class"];
    }

    attributeChangedCallback(): void {
        const el = this.querySelector<HTMLButtonElement>(":scope > button.tab-bar-button");
        if (!el) return;
        el.className = rootClassName(this, "tab-bar-button");
        const selected = this.hasAttribute("selected");
        el.setAttribute("aria-selected", String(selected));
        el.tabIndex = selected ? 0 : -1;
        setOrRemove(el, "aria-controls", this.getAttribute("controls"));
    }

    connectedCallback(): void {
        if (this.querySelector(":scope > button.tab-bar-button")) return;

        const selected = this.hasAttribute("selected");

        const button = document.createElement("button");
        button.type = "button";
        button.className = rootClassName(this, "tab-bar-button");
        button.setAttribute("role", "tab");
        button.setAttribute("aria-selected", String(selected));
        const controls = this.getAttribute("controls");
        if (controls !== null) button.setAttribute("aria-controls", controls);
        button.tabIndex = selected ? 0 : -1;
        passThroughAttributes(this, button, HANDLED);

        moveChildrenInto(this, button);
        this.appendChild(button);
    }
}
