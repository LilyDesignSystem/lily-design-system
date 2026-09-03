// ToggleButton component
//
// A button that toggles between pressed and unpressed states, reporting
// state via the WAI-ARIA Switch pattern (role="switch" + aria-checked)
// rather than aria-pressed, matching every other framework's port.
//
// Attributes:
//   label — REQUIRED. Accessible name, rendered as aria-label.
//   pressed — presence-based boolean; toggled on click. Reflected back
//     onto the host attribute so `el.hasAttribute("pressed")` and
//     `el.toggleAttribute("pressed")` both work as an external API.
//   disabled — presence-based boolean.
//
// Fires a bubbling, composed "lily-change" CustomEvent<{ pressed: boolean }>
// whenever the state changes by user interaction.
//
// Keyboard: Space toggles (native <button> click synthesis); Enter
// activates (native). No custom keydown handling is needed — unlike a
// framework port that must call preventDefault() to stop the page
// scrolling on Space, a real <button> already suppresses that natively.
//
// Accessibility:
//   - role="switch" identifies a two-state toggle.
//   - aria-checked communicates on/off.
//   - aria-label is the entire accessible name.
//
// References:
//   - components/toggle-button/index.md (canonical contract)
//   - WAI-ARIA Switch Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/switch/

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "pressed", "disabled"]);

export class ToggleButton extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["pressed", "disabled", "label"];
    }

    #button: HTMLButtonElement | null = null;

    connectedCallback(): void {
        if (this.#button) return;

        const button = document.createElement("button");
        button.type = "button";
        button.className = rootClassName(this, "toggle-button");
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
        button.setAttribute("aria-checked", this.hasAttribute("pressed") ? "true" : "false");
        button.disabled = this.hasAttribute("disabled");
    }

    #onClick = (): void => {
        if (this.hasAttribute("disabled")) return;
        const next = !this.hasAttribute("pressed");
        this.toggleAttribute("pressed", next);
        this.dispatchEvent(
            new CustomEvent("lily-change", { detail: { pressed: next }, bubbles: true, composed: true }),
        );
    };
}
