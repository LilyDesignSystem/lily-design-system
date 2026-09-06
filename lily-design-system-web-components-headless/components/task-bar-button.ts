// TaskBarButton component
//
// One item within a TaskBar. Renders a native <button type="button"> for
// proper keyboard and screen reader support, with a `disabled` state.
//
// Attributes:
//   disabled — presence-based boolean.
//
// References:
//   - components/task-bar-button/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["disabled"]);

export class TaskBarButton extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > button.task-bar-button")) return;

        const button = document.createElement("button");
        button.type = "button";
        button.className = rootClassName(this, "task-bar-button");
        if (this.hasAttribute("disabled")) button.disabled = true;
        passThroughAttributes(this, button, HANDLED);

        moveChildrenInto(this, button);
        this.appendChild(button);
    }
}
