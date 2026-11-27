// MenuBarButton component
//
// One item in a MenuBar. Renders a native <button role="menuitem"> with
// tabindex="-1" so focus is managed programmatically by the parent
// MenuBar's roving keyboard navigation, rather than the ordinary Tab
// order — confirmed against the Vue and HTML ports (a real <button>,
// not the <div> the component's own "Key Behaviors" prose mistakenly
// describes; the AGENTS.md "HTML tag" field agrees with the majority).
//
// Attributes: none beyond the standard rest-props.
//
// Keyboard: Arrow key focus movement is managed by the parent MenuBar;
// Enter/Space activate (native <button> behaviour).
//
// References:
//   - components/menu-bar-button/index.md (canonical contract)
//   - WAI-ARIA Menu Bar Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/menubar/

import {
    moveChildrenInto,
    passThroughAttributes,
    rootClassName,
    followClass,
} from "../lib/dom-utils.js";

const HANDLED: ReadonlySet<string> = new Set();

export class MenuBarButton extends HTMLElement {
    // Its content is the consumer's children, which they change directly; a change to class is shown (tasks.md P50-T28).
    static get observedAttributes(): string[] {
        return ["class"];
    }

    attributeChangedCallback(): void {
        followClass(this, "button.menu-bar-button", "menu-bar-button");
    }

    connectedCallback(): void {
        if (this.querySelector(":scope > button.menu-bar-button")) return;

        const button = document.createElement("button");
        button.type = "button";
        button.className = rootClassName(this, "menu-bar-button");
        button.setAttribute("role", "menuitem");
        button.tabIndex = -1;
        passThroughAttributes(this, button, HANDLED);

        moveChildrenInto(this, button);
        this.appendChild(button);
    }
}
