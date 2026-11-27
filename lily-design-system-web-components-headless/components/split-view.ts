// SplitView component
//
// A two-panel resizable layout container with a draggable divider between
// them. No native element behaviour is worth deferring to for the plain
// `<div>` container, so the custom element instance itself stands in for
// the wrapper (see lib/dom-utils.applySelfClassName). The primary and
// secondary panel content, and an optional custom divider, are light-DOM
// children marked `slot="primary"` / `slot="secondary"` / `slot="divider"`
// — this catalog's light-DOM stand-in for a real `<slot>` (see
// feature-photo.ts for the same technique).
//
// Attributes:
//   label — REQUIRED. aria-label for the container.
//   orientation — "horizontal" | "vertical", default "horizontal".
//   split-percent — number 0-100 as a string, default "50".
//
// Usage:
//   <lily-split-view label="Files and editor" split-percent="30">
//     <div slot="primary">…file browser…</div>
//     <div slot="secondary">…editor…</div>
//   </lily-split-view>
//
// When no `slot="divider"` child is supplied, a default
// `<div class="split-view-divider" role="separator" …>` is rendered
// between the two panels. Drag handling and keyboard resize logic are
// entirely the consumer's responsibility.
//
// References:
//   - components/split-view/index.md (canonical contract)
//   - WAI-ARIA Window Splitter Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/

import { attachSplitView } from "../lib/widget-keys.js";
import { applySelfClassName } from "../lib/dom-utils.js";

export class SplitView extends HTMLElement {
    #built = false;

    // A change to label, orientation or split-percent is shown (tasks.md P50-T28); the panels are the consumer's.
    static get observedAttributes(): string[] {
        return ["label", "orientation", "split-percent", "class"];
    }

    attributeChangedCallback(name: string, before: string | null, after: string | null): void {
        if (!this.#built || before === after) return;
        if (name === "class") {
            if (!this.classList.contains("split-view")) applySelfClassName(this, "split-view");
            return;
        }
        this.#show();
    }

    #show(): void {
        const orientation = this.getAttribute("orientation") ?? "horizontal";
        const splitPercent = this.getAttribute("split-percent") ?? "50";
        const label = this.getAttribute("label");
        if (label !== null) {
            this.setAttribute("aria-label", label);
            if (!this.hasAttribute("role")) this.setAttribute("role", "group");
        } else this.removeAttribute("aria-label");
        this.setAttribute("data-orientation", orientation);
        this.setAttribute("data-split-percent", splitPercent);
        const divider = this.querySelector<HTMLElement>(
            ":scope > .split-view-divider[role='separator']",
        );
        if (divider) {
            divider.setAttribute("aria-orientation", orientation);
            divider.setAttribute("aria-valuenow", splitPercent);
        }
    }

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        const primaryContent = this.querySelector(':scope > [slot="primary"]');
        const secondaryContent = this.querySelector(':scope > [slot="secondary"]');
        const customDivider = this.querySelector(':scope > [slot="divider"]');

        const orientation = this.getAttribute("orientation") ?? "horizontal";
        const splitPercent = this.getAttribute("split-percent") ?? "50";

        applySelfClassName(this, "split-view");

        const primary = document.createElement("section");
        primary.className = "split-view-primary";
        if (primaryContent) primary.appendChild(primaryContent);

        const secondary = document.createElement("section");
        secondary.className = "split-view-secondary";
        if (secondaryContent) secondary.appendChild(secondaryContent);

        let divider: Element;
        if (customDivider) {
            divider = customDivider;
        } else {
            const defaultDivider = document.createElement("div");
            defaultDivider.className = "split-view-divider";
            defaultDivider.setAttribute("role", "separator");
            defaultDivider.setAttribute("aria-orientation", orientation);
            defaultDivider.setAttribute("aria-valuenow", splitPercent);
            defaultDivider.setAttribute("aria-valuemin", "0");
            defaultDivider.setAttribute("aria-valuemax", "100");
            defaultDivider.setAttribute("tabindex", "0");
            divider = defaultDivider;
        }

        this.replaceChildren(primary, divider, secondary);
        this.#show();
        attachSplitView(this);
    }
}
