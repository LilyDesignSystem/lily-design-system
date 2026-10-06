// DateRange component
//
// A display of a start and end date range: two native
// <input type="date"> elements grouped together.
//
// Renders a real <fieldset> (as every sibling catalog does), whose
// native group semantics name the pair via aria-label; each input has the
// `date-input` class and its own accessible name.
//
// Attributes:
//   label — REQUIRED. Accessible group name, via aria-label on the fieldset.
//   start-label — REQUIRED. Accessible name for the start date input.
//   end-label — REQUIRED. Accessible name for the end date input.
//   start — bindable start date value (YYYY-MM-DD); also a live `start`
//     property.
//   end — bindable end date value (YYYY-MM-DD); also a live `end`
//     property.
//   ...rest — spread onto the generated <fieldset>.
//
// References:
//   - components/date-range/index.md (canonical contract)
//   - MDN input type="date": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date
//   - MDN fieldset element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/fieldset

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "start-label", "end-label", "start", "end"]);

export class DateRange extends HTMLElement {
    #root: HTMLFieldSetElement | null = null;
    #start: HTMLInputElement | null = null;
    #end: HTMLInputElement | null = null;

    connectedCallback(): void {
        if (this.#root) return;

        const span = document.createElement("fieldset");
        span.className = rootClassName(this, "date-range");
        const label = this.getAttribute("label");
        if (label !== null) span.setAttribute("aria-label", label);
        passThroughAttributes(this, span, HANDLED);

        const start = document.createElement("input");
        start.className = "date-input";
        start.type = "date";
        const startLabel = this.getAttribute("start-label");
        if (startLabel !== null) start.setAttribute("aria-label", startLabel);
        start.value = this.getAttribute("start") ?? "";

        const end = document.createElement("input");
        end.className = "date-input";
        end.type = "date";
        const endLabel = this.getAttribute("end-label");
        if (endLabel !== null) end.setAttribute("aria-label", endLabel);
        end.value = this.getAttribute("end") ?? "";

        span.appendChild(start);
        span.appendChild(end);

        this.appendChild(span);
        this.#root = span;
        this.#start = start;
        this.#end = end;
    }

    get start(): string {
        return this.#start?.value ?? this.getAttribute("start") ?? "";
    }

    set start(v: string) {
        if (this.#start) this.#start.value = v;
        else this.setAttribute("start", v);
    }

    get end(): string {
        return this.#end?.value ?? this.getAttribute("end") ?? "";
    }

    set end(v: string) {
        if (this.#end) this.#end.value = v;
        else this.setAttribute("end", v);
    }
}
