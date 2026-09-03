// FloatButton component
//
// A floating action button anchored to a viewport corner.
//
// Attributes:
//   label — REQUIRED. The accessible name, via aria-label.
//   position — "top-left" | "top-right" | "bottom-left" | "bottom-right",
//     default "bottom-right". Exposed as data-position; drives the
//     inline `position: fixed` corner offset (structural, not visual —
//     see AGENTS/headless.md's inline-style exception for cases where
//     the position genuinely IS the component's job, same reasoning
//     ThemeProvider's `display: contents` uses).
//   type — "button" | "submit" | "reset", default "button".
//   disabled — presence-based boolean.
//
// References:
//   - components/float-button/index.md (canonical contract)
//   - WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

type Position = "top-left" | "top-right" | "bottom-left" | "bottom-right";

const OFFSET = "1rem";
const HANDLED = new Set(["label", "position", "type", "disabled"]);

function cornerStyle(position: Position): string {
    const v = position.startsWith("top") ? `top: ${OFFSET};` : `bottom: ${OFFSET};`;
    const h = position.endsWith("left") ? `left: ${OFFSET};` : `right: ${OFFSET};`;
    return `position: fixed; ${v} ${h}`;
}

export class FloatButton extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > button.float-button")) return;

        const position = (this.getAttribute("position") as Position | null) ?? "bottom-right";
        const button = document.createElement("button");
        button.className = rootClassName(this, "float-button");
        button.type = (this.getAttribute("type") as "button" | "submit" | "reset" | null) ?? "button";
        if (this.hasAttribute("disabled")) button.disabled = true;
        const label = this.getAttribute("label");
        if (label === null) {
            throw new Error("<lily-float-button> requires a label attribute (WCAG 4.1.2)");
        }
        button.setAttribute("aria-label", label);
        button.setAttribute("data-position", position);
        button.setAttribute("style", cornerStyle(position));
        passThroughAttributes(this, button, HANDLED);

        moveChildrenInto(this, button);
        this.appendChild(button);
    }
}
