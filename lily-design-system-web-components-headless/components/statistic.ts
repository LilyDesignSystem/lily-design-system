// Statistic component
//
// A numeric value display with title, prefix, and suffix. Renders a
// <div role="group">; the custom element stands in for that div directly
// (see lib/dom-utils.applySelfClassName) since <div> has no native
// behaviour worth preserving as a separate element. The consumer is
// responsible for formatting the value as a string (number formatting,
// localisation).
//
// Attributes:
//   title — REQUIRED. Statistic label/heading.
//   value — REQUIRED. Pre-formatted value text.
//   label — optional; aria-label override (defaults to "{title}: {value}").
//   prefix — optional. Text before the value (e.g. a currency symbol).
//   suffix — optional. Text after the value (e.g. a unit or "%").
//
// References:
//   - components/statistic/index.md (canonical contract)
//   - Ant Design Statistic: https://ant.design/components/statistic

import { applySelfClassName } from "../lib/dom-utils.js";

export class Statistic extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "statistic");
        this.setAttribute("role", "group");

        const title = this.getAttribute("title") ?? "";
        const value = this.getAttribute("value") ?? "";
        const label = this.getAttribute("label");
        this.setAttribute("aria-label", label ?? `${title}: ${value}`);

        const titleEl = document.createElement("div");
        titleEl.className = "statistic-title";
        titleEl.textContent = title;
        this.appendChild(titleEl);

        const valueEl = document.createElement("div");
        valueEl.className = "statistic-value";

        const prefix = this.getAttribute("prefix");
        if (prefix !== null) {
            const prefixEl = document.createElement("span");
            prefixEl.className = "statistic-prefix";
            prefixEl.textContent = prefix;
            valueEl.appendChild(prefixEl);
        }

        valueEl.appendChild(document.createTextNode(value));

        const suffix = this.getAttribute("suffix");
        if (suffix !== null) {
            const suffixEl = document.createElement("span");
            suffixEl.className = "statistic-suffix";
            suffixEl.textContent = suffix;
            valueEl.appendChild(suffixEl);
        }

        this.appendChild(valueEl);
    }
}
