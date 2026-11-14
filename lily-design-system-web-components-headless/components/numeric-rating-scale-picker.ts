// <lily-numeric-rating-scale-picker>: a 0 to 10 rating such as a numeric pain rating scale (spec/healthcare-ui item 12).
// Renders a light-DOM <fieldset class="numeric-rating-scale-picker"> named by its legend, one native radio per number, the
// consumer's anchor words linked to the end radios. Attributes: label, min, max, min-label, max-label, value, name,
// required. Fires a bubbling "change" from the chosen radio; the host's value property reads the choice.
import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set([
    "label",
    "min",
    "max",
    "min-label",
    "max-label",
    "value",
    "name",
    "required",
]);
let nextId = 0;

export class NumericRatingScalePicker extends HTMLElement {
    #fieldset: HTMLFieldSetElement | null = null;

    connectedCallback(): void {
        if (this.#fieldset) return;
        const attr = (name: string) => this.getAttribute(name) ?? "";
        const min = Number(this.getAttribute("min") ?? 0);
        const max = Number(this.getAttribute("max") ?? 10);
        const id = `numeric-rating-scale-picker-${++nextId}`;
        const fieldset = document.createElement("fieldset");
        fieldset.className = rootClassName(this, "numeric-rating-scale-picker");
        passThroughAttributes(this, fieldset, HANDLED);
        const legend = document.createElement("legend");
        legend.className = "numeric-rating-scale-picker-legend";
        legend.textContent = attr("label");
        fieldset.append(legend);
        const anchor = (which: "min" | "max") => {
            const span = document.createElement("span");
            span.className = `numeric-rating-scale-picker-${which}-label`;
            span.id = `${id}-${which}`;
            span.textContent = attr(`${which}-label`);
            return span;
        };
        if (attr("min-label")) fieldset.append(anchor("min"));
        const options = document.createElement("span");
        options.className = "numeric-rating-scale-picker-options";
        for (let step = min; step <= max; step += 1) {
            const label = document.createElement("label");
            label.className = "numeric-rating-scale-picker-option";
            const input = document.createElement("input");
            input.type = "radio";
            input.name = attr("name") || "rating";
            input.value = String(step);
            input.checked = attr("value") === String(step);
            if (step === min && this.hasAttribute("required")) input.required = true;
            if (step === min && attr("min-label"))
                input.setAttribute("aria-describedby", `${id}-min`);
            else if (step === max && attr("max-label"))
                input.setAttribute("aria-describedby", `${id}-max`);
            label.append(input, ` ${step}`);
            options.append(label);
        }
        fieldset.append(options);
        if (attr("max-label")) fieldset.append(anchor("max"));
        this.appendChild(fieldset);
        this.#fieldset = fieldset;
    }

    get value(): string {
        return (
            this.#fieldset?.querySelector<HTMLInputElement>("input:checked")?.value ??
            this.getAttribute("value") ??
            ""
        );
    }
}
