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
import { LiveElement, part, setOrRemove } from "../lib/live-element.js";

const SHOWN = [
    "title",
    "value",
    "label",
    "prefix",
    "suffix",
    "change",
    "trend",
    "as-of",
    "as-of-label",
];

// A change to any attribute it shows, or to class, is shown (tasks.md P50-T28).
export class Statistic extends LiveElement {
    static get observedAttributes(): string[] {
        return [...SHOWN, "class"];
    }

    protected update(): void {
        applySelfClassName(this, "statistic");
        this.setAttribute("role", "group");

        const title = this.text("title");
        const value = this.text("value");
        this.setAttribute("aria-label", this.getAttribute("label") ?? `${title}: ${value}`);

        for (const old of this.querySelectorAll(
            ":scope > .statistic-title, :scope > .statistic-value, :scope > .statistic-change, :scope > .statistic-as-of",
        ))
            old.remove();

        const titleEl = document.createElement("div");
        titleEl.className = "statistic-title";
        titleEl.textContent = title;
        this.appendChild(titleEl);

        const valueEl = document.createElement("div");
        valueEl.className = "statistic-value";
        const prefix = this.getAttribute("prefix");
        if (prefix !== null) valueEl.append(part("statistic-prefix", prefix));
        valueEl.append(value);
        const suffix = this.getAttribute("suffix");
        if (suffix !== null) valueEl.append(part("statistic-suffix", suffix));
        this.appendChild(valueEl);

        // The change, in words that name its comparison; its direction is data-trend for the theme, never an arrow here.
        const change = this.getAttribute("change");
        if (change) {
            const changeEl = document.createElement("div");
            changeEl.className = "statistic-change";
            setOrRemove(changeEl, "data-trend", this.getAttribute("trend"));
            changeEl.textContent = change;
            this.appendChild(changeEl);
        }

        // When the value was measured: a <time>, shown only with its words.
        const asOfLabel = this.getAttribute("as-of-label");
        if (asOfLabel) {
            const time = document.createElement("time");
            time.className = "statistic-as-of";
            setOrRemove(time, "datetime", this.getAttribute("as-of"));
            time.textContent = asOfLabel;
            this.appendChild(time);
        }
    }
}
