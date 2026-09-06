// ToolBarButton component
//
// One action button within a ToolBar. Renders a native
// <button type="button"> for proper keyboard and screen reader support,
// with a `disabled` state. The parent ToolBar manages roving-focus
// keyboard navigation between buttons.
//
// Attributes:
//   disabled — presence-based boolean.
//
// References:
//   - components/tool-bar-button/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["disabled"]);

export class ToolBarButton extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > button.tool-bar-button")) return;

        const button = document.createElement("button");
        button.type = "button";
        button.className = rootClassName(this, "tool-bar-button");
        if (this.hasAttribute("disabled")) button.disabled = true;
        passThroughAttributes(this, button, HANDLED);

        moveChildrenInto(this, button);
        this.appendChild(button);
    }
}
