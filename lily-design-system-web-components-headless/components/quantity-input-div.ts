// <lily-quantity-input-div>: a quantity entered as a number and a unit, each unit with its own min, max and step (tasks.md
// P29-T8). Builds a light-DOM <div class="quantity-input-div" role="group"> with a labelled number input and, for more than
// one unit, a labelled unit <select>; one unit is text linked by aria-describedby. Nothing is converted.
// Attributes: label, magnitude-label, unit-label, units (a JSON array of { value, label, min?, max?, step? }), magnitude,
//   unit, name, required, disabled, id (read once). Properties: magnitude, unit.
import { nextId, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

type Unit = { value: string; label: string; min?: number; max?: number; step?: number | "any" };

const HANDLED = new Set([
    "label",
    "magnitude-label",
    "unit-label",
    "units",
    "magnitude",
    "unit",
    "name",
    "required",
    "disabled",
    "id",
]);

export class QuantityInputDiv extends HTMLElement {
    #root: HTMLDivElement | null = null;
    #number: HTMLInputElement | null = null;
    #select: HTMLSelectElement | null = null;
    #baseId = "";

    #units(): Unit[] {
        try {
            const parsed = JSON.parse(this.getAttribute("units") || "[]");
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }

    get magnitude(): string {
        return this.#number?.value ?? this.getAttribute("magnitude") ?? "";
    }

    get unit(): string {
        if (this.#select) return this.#select.value;
        return this.getAttribute("unit") || this.#units()[0]?.value || "";
    }

    // A change to any attribute is shown (tasks.md P50-T28): the parts are built again. magnitude and unit are the defaults: an
    // amount the person typed and a unit they chose stay, while that unit is still offered.
    static get observedAttributes(): string[] {
        return [...HANDLED].filter((name) => name !== "id").concat("class");
    }

    attributeChangedCallback(): void {
        const root = this.#root;
        const number = this.#number;
        if (!root || !number) return;
        const typed = number.value !== number.defaultValue ? number.value : null;
        const select = this.#select;
        const chosen = select && !select.selectedOptions[0]?.defaultSelected ? select.value : null;
        root.className = rootClassName(this, "quantity-input-div");
        root.setAttribute("aria-label", this.getAttribute("label") ?? "");
        root.replaceChildren();
        this.#select = null;
        this.#fill(root);
        if (typed !== null) this.#number!.value = typed;
        if (chosen !== null && this.#select) {
            const option = Array.from((this.#select as HTMLSelectElement).options).find(
                (o) => o.value === chosen,
            );
            if (option) option.selected = true;
        }
        this.#limit();
    }

    connectedCallback(): void {
        if (this.#root) return;
        this.#baseId = this.getAttribute("id") || nextId("lily-quantity-input-div");
        if (this.hasAttribute("id")) this.removeAttribute("id");

        const root = document.createElement("div");
        root.className = rootClassName(this, "quantity-input-div");
        root.setAttribute("role", "group");
        root.setAttribute("aria-label", this.getAttribute("label") ?? "");
        passThroughAttributes(this, root, HANDLED);
        this.#fill(root);
        this.#root = root;
        this.appendChild(root);
        this.closest("form")?.addEventListener("reset", () => setTimeout(() => this.#limit(), 0));
        this.#limit();
    }

    #fill(root: HTMLDivElement): void {
        const baseId = this.#baseId;
        const units = this.#units();
        const name = this.getAttribute("name");
        const required = this.hasAttribute("required");
        const disabled = this.hasAttribute("disabled");

        const label = document.createElement("label");
        label.htmlFor = `${baseId}-magnitude`;
        label.textContent = this.getAttribute("magnitude-label") ?? "";
        const number = document.createElement("input");
        number.className = "quantity-input-div-magnitude";
        number.id = `${baseId}-magnitude`;
        number.type = "number";
        number.inputMode = "decimal";
        if (name) number.name = `${name}-magnitude`;
        number.defaultValue = this.getAttribute("magnitude") ?? "";
        number.required = required;
        number.disabled = disabled;
        root.append(label, number);

        if (units.length > 1) {
            const unitLabel = document.createElement("label");
            unitLabel.htmlFor = `${baseId}-unit`;
            unitLabel.textContent = this.getAttribute("unit-label") ?? "";
            const select = document.createElement("select");
            select.className = "quantity-input-div-unit";
            select.id = `${baseId}-unit`;
            if (name) select.name = `${name}-unit`;
            const initial = this.getAttribute("unit") || units[0].value;
            for (const u of units) {
                const option = document.createElement("option");
                option.value = u.value;
                option.textContent = u.label;
                option.defaultSelected = u.value === initial;
                select.append(option);
            }
            select.required = required;
            select.disabled = disabled;
            select.addEventListener("change", () => this.#limit());
            root.append(unitLabel, select);
            this.#select = select;
        } else if (units.length === 1) {
            const unit = document.createElement("span");
            unit.className = "quantity-input-div-unit";
            unit.id = `${baseId}-unit`;
            unit.textContent = units[0].label;
            number.setAttribute("aria-describedby", unit.id);
            root.append(unit);
            if (name) {
                const hidden = document.createElement("input");
                hidden.type = "hidden";
                hidden.name = `${name}-unit`;
                hidden.value = units[0].value;
                root.append(hidden);
            }
        }
        this.#number = number;
    }

    /** The number takes the limits of the unit chosen. */
    #limit(): void {
        const units = this.#units();
        const chosen = units.find((u) => u.value === this.unit) ?? units[0];
        const number = this.#number;
        if (!number) return;
        for (const key of ["min", "max", "step"] as const) {
            const value = chosen?.[key];
            if (value === undefined) number.removeAttribute(key);
            else number.setAttribute(key, String(value));
        }
    }
}
