// AccordionCheckbox component
//
// A checkbox option that reveals an accordion panel when checked. The
// canonical HTML tag is <div>, and the custom element stands in for that
// wrapper div directly (see lib/dom-utils.applySelfClassName); the checkbox
// input, its label, and the revealable panel are all built as constructed
// children inside it, moving the host's original light-DOM children (the
// panel content) into the panel.
//
// Attributes:
//   label — REQUIRED. The checkbox label text.
//   checked — presence-based boolean; bindable. Reveals the panel when
//     present.
//   data-id — optional base id used to link the checkbox and panel
//     (auto-generated when absent so multiple instances don't collide).
//
// Fires a bubbling, composed "lily-change" CustomEvent<{ checked: boolean }>
// whenever the state changes by user interaction.
//
// Keyboard: Tab focuses the checkbox; Space toggles it (native <input
// type="checkbox"> behaviour).
//
// References:
//   - components/accordion-checkbox/index.md (canonical contract)
//   - WAI-ARIA Disclosure Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/

import { applySelfClassName, nextId } from "../lib/dom-utils.js";

export class AccordionCheckbox extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["checked", "label"];
    }

    #built = false;
    #input: HTMLInputElement | null = null;
    #panel: HTMLDivElement | null = null;

    connectedCallback(): void {
        if (!this.#built) {
            this.#built = true;
            applySelfClassName(this, "accordion-checkbox");

            const baseId = this.getAttribute("data-id") ?? nextId("accordion-checkbox");
            const checkboxId = `${baseId}-checkbox`;
            const panelId = `${baseId}-panel`;

            // Capture the host's original children as the panel content.
            const panelChildren = Array.from(this.childNodes);

            const input = document.createElement("input");
            input.type = "checkbox";
            input.className = "accordion-checkbox-input";
            input.id = checkboxId;
            input.setAttribute("aria-controls", panelId);
            input.addEventListener("change", this.#onChange);

            const label = document.createElement("label");
            label.className = "accordion-checkbox-label";
            label.setAttribute("for", checkboxId);
            label.textContent = this.getAttribute("label") ?? "";

            const panel = document.createElement("div");
            panel.className = "accordion-checkbox-panel";
            panel.id = panelId;
            panel.setAttribute("role", "region");
            panel.setAttribute("aria-labelledby", checkboxId);
            for (const node of panelChildren) panel.appendChild(node);

            this.appendChild(input);
            this.appendChild(label);
            this.appendChild(panel);

            this.#input = input;
            this.#panel = panel;
        }
        this.#sync();
    }

    attributeChangedCallback(): void {
        this.#sync();
    }

    #sync(): void {
        if (!this.#built || !this.#input || !this.#panel) return;
        const checked = this.hasAttribute("checked");
        this.#input.checked = checked;
        this.#input.setAttribute("aria-expanded", checked ? "true" : "false");
        this.#panel.hidden = !checked;

        const label = this.getAttribute("label");
        const labelEl = this.querySelector<HTMLLabelElement>(":scope > label.accordion-checkbox-label");
        if (label !== null && labelEl) labelEl.textContent = label;
    }

    #onChange = (): void => {
        const checked = this.#input?.checked ?? false;
        this.toggleAttribute("checked", checked);
        this.dispatchEvent(
            new CustomEvent("lily-change", { detail: { checked }, bubbles: true, composed: true }),
        );
    };
}
