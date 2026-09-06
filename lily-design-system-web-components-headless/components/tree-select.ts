// TreeSelect component
//
// A select dropdown showing a tree of hierarchical options. Renders a
// <div role="combobox">; the custom element stands in for that div
// directly (see lib/dom-utils.applySelfClassName) since <div> has no
// native behaviour worth preserving as a separate element. Behaviour
// idiom follows this catalog's own split-button.ts: internal open/closed
// state, reflected via aria-expanded/hidden, plus a bubbling, composed
// "lily-expanded-change" CustomEvent<{ expanded: boolean }> so a consumer
// can observe the toggle without polling attributes.
//
// Attributes:
//   label — REQUIRED. aria-label for the combobox.
//   expanded — presence-based boolean; bindable (also a JS `expanded`
//     property, mirroring split-button's `menuOpen`).
//   disabled — presence-based boolean; disables the trigger.
//   multiple — presence-based boolean; sets aria-multiselectable="true".
//   placeholder — optional. Trigger text when no value is set.
//   value — optional. Display value shown on the trigger.
//
// The `children` slot is tree content only (typically TreeNav/TreeList),
// moved into `.tree-select-panel` — the trigger's text comes from the
// value/placeholder attributes instead, since those are plain strings.
//
// Keyboard:
//   Tab — focus the trigger.
//   Enter/Space (native <button> activation) — toggle the panel.
//   Escape — close the panel and return focus to the trigger.
//
// References:
//   - components/tree-select/index.md (canonical contract)
//   - WAI-ARIA Combobox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
//   - WAI-ARIA Tree Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/

import { applySelfClassName, moveChildrenInto } from "../lib/dom-utils.js";

export class TreeSelect extends HTMLElement {
    #built = false;
    #trigger: HTMLButtonElement | null = null;
    #panel: HTMLDivElement | null = null;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "tree-select");
        this.setAttribute("role", "combobox");
        this.setAttribute("aria-haspopup", "tree");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
        if (this.hasAttribute("multiple")) this.setAttribute("aria-multiselectable", "true");

        const trigger = document.createElement("button");
        trigger.type = "button";
        trigger.className = "tree-select-trigger";
        trigger.textContent = this.getAttribute("value") ?? this.getAttribute("placeholder") ?? "";
        trigger.disabled = this.hasAttribute("disabled");

        const panel = document.createElement("div");
        panel.className = "tree-select-panel";

        moveChildrenInto(this, panel);

        const initiallyExpanded = this.hasAttribute("expanded");
        this.setAttribute("aria-expanded", initiallyExpanded ? "true" : "false");
        panel.hidden = !initiallyExpanded;

        trigger.addEventListener("click", () => {
            if (trigger.disabled) return;
            this.expanded = this.getAttribute("aria-expanded") !== "true";
        });

        this.addEventListener("keydown", (event: Event) => {
            const keyboardEvent = event as KeyboardEvent;
            if (keyboardEvent.key === "Escape" && this.getAttribute("aria-expanded") === "true") {
                this.expanded = false;
                trigger.focus();
            }
        });

        this.appendChild(trigger);
        this.appendChild(panel);
        this.#trigger = trigger;
        this.#panel = panel;
    }

    get expanded(): boolean {
        return this.getAttribute("aria-expanded") === "true";
    }

    set expanded(value: boolean) {
        if (this.getAttribute("aria-expanded") === (value ? "true" : "false")) return;
        this.toggleAttribute("expanded", value);
        this.setAttribute("aria-expanded", value ? "true" : "false");
        if (this.#panel) this.#panel.hidden = !value;
        this.dispatchEvent(
            new CustomEvent("lily-expanded-change", { detail: { expanded: value }, bubbles: true, composed: true }),
        );
    }

    get disabled(): boolean {
        return this.#trigger?.disabled ?? this.hasAttribute("disabled");
    }

    set disabled(value: boolean) {
        this.toggleAttribute("disabled", value);
        if (this.#trigger) this.#trigger.disabled = value;
    }
}
