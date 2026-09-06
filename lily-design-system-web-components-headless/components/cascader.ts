// Cascader component
//
// A multi-level dropdown for selecting a value from a hierarchy. The
// canonical HTML tag is <div>, and the custom element stands in for that
// wrapper div directly (see lib/dom-utils.applySelfClassName): a real
// <button class="cascader-trigger"> and a <div class="cascader-panel">
// are built as constructed children, moving the host's original
// light-DOM children (the panel's nested option lists) into the panel.
//
// Unlike react-headless's fully-controlled port (where the consumer must
// toggle `expanded` itself via `onClick`), this component self-manages
// `expanded` as a bindable host attribute — matching Dialog's `open` and
// every other interactive component in this catalog, and matching
// html-headless's real click-to-toggle script.
//
// Attributes:
//   label — REQUIRED. Accessible name via aria-label.
//   expanded — presence-based boolean; bindable. Shows/hides the panel.
//   disabled — presence-based boolean; disables the trigger button.
//   placeholder — shown on the trigger when no value is set.
//   value — display value shown on the trigger.
//
// Keyboard: Tab focuses the trigger; Enter/Space toggle the panel (native
// <button> behaviour); Escape on the trigger closes the panel.
//
// References:
//   - components/cascader/index.md (canonical contract)
//   - WAI-ARIA Combobox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/

import { applySelfClassName, nextId } from "../lib/dom-utils.js";

export class Cascader extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["expanded", "label", "disabled", "placeholder", "value"];
    }

    #built = false;
    #trigger: HTMLButtonElement | null = null;
    #panel: HTMLDivElement | null = null;

    connectedCallback(): void {
        if (!this.#built) {
            this.#built = true;
            applySelfClassName(this, "cascader");
            this.setAttribute("role", "combobox");
            this.setAttribute("aria-haspopup", "tree");
            this.id = this.id || nextId("cascader");

            // Capture the host's original children as the panel content.
            const panelChildren = Array.from(this.childNodes);

            const trigger = document.createElement("button");
            trigger.type = "button";
            trigger.className = "cascader-trigger";
            trigger.addEventListener("click", this.#onTriggerClick);
            trigger.addEventListener("keydown", this.#onTriggerKeydown);

            const panel = document.createElement("div");
            panel.className = "cascader-panel";
            for (const node of panelChildren) panel.appendChild(node);

            this.appendChild(trigger);
            this.appendChild(panel);
            this.#trigger = trigger;
            this.#panel = panel;
        }
        this.#sync();
    }

    attributeChangedCallback(): void {
        this.#sync();
    }

    #sync(): void {
        if (!this.#built || !this.#trigger || !this.#panel) return;
        const expanded = this.hasAttribute("expanded");
        this.setAttribute("aria-expanded", expanded ? "true" : "false");
        this.#panel.hidden = !expanded;

        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);

        this.#trigger.disabled = this.hasAttribute("disabled");
        this.#trigger.textContent = this.getAttribute("value") || this.getAttribute("placeholder") || "";
    }

    #onTriggerClick = (): void => {
        if (this.hasAttribute("disabled")) return;
        this.toggleAttribute("expanded", !this.hasAttribute("expanded"));
    };

    #onTriggerKeydown = (event: KeyboardEvent): void => {
        if (event.key === "Escape" && this.hasAttribute("expanded")) {
            event.preventDefault();
            this.removeAttribute("expanded");
        }
    };
}
