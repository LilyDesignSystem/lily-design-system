// DateField component
//
// A date asked for as three parts, day, month and year, in a <fieldset> named by its
// <legend>, with optional helper text and an error message, all linked by generated
// ids. The element builds a <fieldset class="date-field"> inside itself. The order of
// the parts and every label are the consumer's: there is no regional or English default.
//
// Attributes:
//   label — REQUIRED. The legend, naming the whole date.
//   day-label, month-label, year-label — REQUIRED. The three parts' labels.
//   order — "ymd" (ISO 8601, default) | "dmy" | "mdy". The order of the parts.
//   value — YYYY-MM-DD once all three parts are filled, else ""; also a live `value`
//     property. A new value fills the parts; "input" and "change" bubble from the parts.
//   name — optional base name: the parts are {name}-day, -month, -year.
//   autocomplete — "bday", optional: the parts autocomplete as bday-day, -month, -year.
//   description, error — optional, linked from the fieldset.
//   required, disabled — presence-based booleans.
//   id — optional base id for the parts (read once and removed from the host).
//
// References:
//   - components/date-field/index.md (canonical contract)
//   - WAI Forms Tutorial, grouping controls: https://www.w3.org/WAI/tutorials/forms/grouping/

import { nextId, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

type Part = "day" | "month" | "year";
type Parts = Record<Part, string>;

const SEQUENCES: Record<string, Part[]> = {
    ymd: ["year", "month", "day"],
    dmy: ["day", "month", "year"],
    mdy: ["month", "day", "year"],
};

/** The parts of a YYYY-MM-DD value, or empty parts for anything else. */
function split(v: string | null): Parts {
    const m = /^(\d{1,4})-(\d{1,2})-(\d{1,2})$/.exec(v ?? "");
    return m ? { year: m[1], month: m[2], day: m[3] } : { year: "", month: "", day: "" };
}

/** YYYY-MM-DD when every part is a number, else "". The calendar check is the consumer's. */
function join(p: Parts): string {
    if (![p.year, p.month, p.day].every((x) => /^\d+$/.test(x))) return "";
    return `${p.year.padStart(4, "0")}-${p.month.padStart(2, "0")}-${p.day.padStart(2, "0")}`;
}

const HANDLED = new Set([
    "label",
    "day-label",
    "month-label",
    "year-label",
    "order",
    "value",
    "name",
    "autocomplete",
    "description",
    "error",
    "required",
    "disabled",
    "id",
]);

export class DateField extends HTMLElement {
    static get observedAttributes(): string[] {
        return [...HANDLED].filter((name) => name !== "id");
    }

    #built = false;
    #fieldset: HTMLFieldSetElement | null = null;
    #legend: HTMLLegendElement | null = null;
    #inputs: Record<Part, HTMLInputElement> | null = null;
    #labels: Record<Part, HTMLLabelElement> | null = null;
    #descriptionEl: HTMLParagraphElement | null = null;
    #errorEl: HTMLParagraphElement | null = null;
    #baseId = "";

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        const explicitId = this.getAttribute("id");
        if (explicitId) this.removeAttribute("id");
        this.#baseId = explicitId || nextId("lily-date-field");

        const fieldset = document.createElement("fieldset");
        fieldset.className = rootClassName(this, "date-field");
        passThroughAttributes(this, fieldset, HANDLED);
        const legend = document.createElement("legend");
        fieldset.appendChild(legend);

        const labels = {} as Record<Part, HTMLLabelElement>;
        const inputs = {} as Record<Part, HTMLInputElement>;
        for (const part of ["year", "month", "day"] as Part[]) {
            const label = document.createElement("label");
            label.htmlFor = `${this.#baseId}-${part}`;
            const input = document.createElement("input");
            input.className = `date-field-${part}`;
            input.id = `${this.#baseId}-${part}`;
            input.type = "text";
            input.inputMode = "numeric";
            input.maxLength = part === "year" ? 4 : 2;
            input.addEventListener("input", this.#onInput);
            labels[part] = label;
            inputs[part] = input;
        }
        this.#fieldset = fieldset;
        this.#legend = legend;
        this.#labels = labels;
        this.#inputs = inputs;
        this.appendChild(fieldset);

        const parts = split(this.getAttribute("value"));
        for (const part of ["year", "month", "day"] as Part[]) {
            // defaultValue too: a form reset restores an input to its default.
            inputs[part].defaultValue = parts[part];
            inputs[part].value = parts[part];
        }
        this.#sync();
    }

    attributeChangedCallback(): void {
        this.#sync();
    }

    get value(): string {
        return this.#inputs ? join(this.#parts()) : (this.getAttribute("value") ?? "");
    }

    set value(v: string) {
        this.setAttribute("value", v);
    }

    #parts(): Parts {
        const i = this.#inputs!;
        return { year: i.year.value, month: i.month.value, day: i.day.value };
    }

    #sync(): void {
        if (!this.#built) return;
        const fieldset = this.#fieldset!;
        const inputs = this.#inputs!;
        const labels = this.#labels!;

        this.#legend!.textContent = this.getAttribute("label") ?? "";
        labels.day.textContent = this.getAttribute("day-label") ?? "";
        labels.month.textContent = this.getAttribute("month-label") ?? "";
        labels.year.textContent = this.getAttribute("year-label") ?? "";

        const sequence = SEQUENCES[this.getAttribute("order") ?? "ymd"] ?? SEQUENCES.ymd;
        for (const part of sequence)
            fieldset.insertBefore(labels[part], this.#descriptionEl ?? this.#errorEl);
        for (const part of sequence) fieldset.insertBefore(inputs[part], labels[part].nextSibling);

        // A value set from outside fills the parts; one the parts produced leaves them as typed.
        const value = this.getAttribute("value");
        if (value !== null && value !== join(this.#parts())) {
            const parts = split(value);
            for (const part of sequence) inputs[part].value = parts[part];
        }

        const name = this.getAttribute("name");
        const autocomplete = this.getAttribute("autocomplete");
        const required = this.hasAttribute("required");
        for (const part of sequence) {
            if (name) inputs[part].name = `${name}-${part}`;
            else inputs[part].removeAttribute("name");
            if (autocomplete === "bday") inputs[part].setAttribute("autocomplete", `bday-${part}`);
            else inputs[part].removeAttribute("autocomplete");
            inputs[part].required = required;
        }
        fieldset.disabled = this.hasAttribute("disabled");

        const describedBy: string[] = [];
        const description = this.getAttribute("description");
        if (description !== null) {
            if (!this.#descriptionEl) {
                this.#descriptionEl = document.createElement("p");
                this.#descriptionEl.id = `${this.#baseId}-desc`;
                fieldset.insertBefore(this.#descriptionEl, this.#errorEl);
            }
            this.#descriptionEl.textContent = description;
            describedBy.push(this.#descriptionEl.id);
        } else if (this.#descriptionEl) {
            this.#descriptionEl.remove();
            this.#descriptionEl = null;
        }

        const error = this.getAttribute("error");
        if (error !== null) {
            if (!this.#errorEl) {
                this.#errorEl = document.createElement("p");
                this.#errorEl.id = `${this.#baseId}-error`;
                this.#errorEl.setAttribute("role", "alert");
                fieldset.appendChild(this.#errorEl);
            }
            this.#errorEl.textContent = error;
            describedBy.push(this.#errorEl.id);
        } else if (this.#errorEl) {
            this.#errorEl.remove();
            this.#errorEl = null;
        }
        if (describedBy.length) fieldset.setAttribute("aria-describedby", describedBy.join(" "));
        else fieldset.removeAttribute("aria-describedby");
        for (const part of sequence) {
            if (error !== null) inputs[part].setAttribute("aria-invalid", "true");
            else inputs[part].removeAttribute("aria-invalid");
        }
    }

    #onInput = (): void => {
        const value = join(this.#parts());
        if (this.getAttribute("value") !== value) this.setAttribute("value", value);
    };
}
