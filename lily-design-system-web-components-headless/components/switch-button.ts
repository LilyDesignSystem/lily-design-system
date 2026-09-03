// SwitchButton component
//
// A toggle switch for turning a setting on or off. Same WAI-ARIA Switch
// pattern as ToggleButton, but the canonical prop is named `checked`
// rather than `pressed` — the two components are kept distinct across
// every framework port, so this one is too.
//
// Attributes:
//   label — REQUIRED. Accessible name, rendered as aria-label.
//   checked — presence-based boolean; toggled on click, reflected back
//     onto the host attribute.
//   disabled — presence-based boolean.
//
// Fires a bubbling, composed "lily-change" CustomEvent<{ checked: boolean }>
// whenever the state changes by user interaction.
//
// Accessibility: role="switch" + aria-checked + aria-label (the entire
// accessible name).
//
// References:
//   - components/switch-button/index.md (canonical contract)
//   - WAI-ARIA Switch Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/switch/

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "checked", "disabled"]);

export class SwitchButton extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["checked", "disabled", "label"];
    }

    #button: HTMLButtonElement | null = null;

    connectedCallback(): void {
        if (this.#button) return;

        const button = document.createElement("button");
        button.type = "button";
        button.className = rootClassName(this, "switch-button");
        button.setAttribute("role", "switch");
        passThroughAttributes(this, button, HANDLED);
        button.addEventListener("click", this.#onClick);

        moveChildrenInto(this, button);
        this.appendChild(button);
        this.#button = button;
        this.#sync();
    }

    attributeChangedCallback(): void {
        this.#sync();
    }

    #sync(): void {
        const button = this.#button;
        if (!button) return;
        const label = this.getAttribute("label");
        if (label !== null) button.setAttribute("aria-label", label);
        button.setAttribute("aria-checked", this.hasAttribute("checked") ? "true" : "false");
        button.disabled = this.hasAttribute("disabled");
    }

    #onClick = (): void => {
        if (this.hasAttribute("disabled")) return;
        const next = !this.hasAttribute("checked");
        this.toggleAttribute("checked", next);
        this.dispatchEvent(
            new CustomEvent("lily-change", { detail: { checked: next }, bubbles: true, composed: true }),
        );
    };
}
