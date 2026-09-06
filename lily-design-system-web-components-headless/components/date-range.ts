// DateRange component
//
// A display of a start and end date range: two native
// <input type="date"> elements grouped together.
//
// The canonical AGENTS.md metadata field ("HTML tag: <span>" — the
// single source of truth per this catalog's headless design rules) is
// internally inconsistent with its own "Key Behaviors" prose, which
// describes a <fieldset>. Every other framework's port actually renders
// a <fieldset> (verified against lily-design-system-svelte-headless).
// Followed the metadata field here as instructed: this component wraps
// a real <span> (Pattern 1 — a <span> cannot itself be a <fieldset>),
// carrying `role="group"` + `aria-label` to reproduce the fieldset's
// grouping semantics without the fieldset element itself. Flagged as a
// deliberate, documented deviation from the sibling catalogs.
//
// Attributes:
//   label — REQUIRED. Accessible group name, via aria-label (role=group).
//   start-label — REQUIRED. Accessible name for the start date input.
//   end-label — REQUIRED. Accessible name for the end date input.
//   start — bindable start date value (YYYY-MM-DD); also a live `start`
//     property.
//   end — bindable end date value (YYYY-MM-DD); also a live `end`
//     property.
//   ...rest — spread onto the generated <span>.
//
// References:
//   - components/date-range/index.md (canonical contract)
//   - MDN input type="date": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date
//   - MDN fieldset element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/fieldset

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "start-label", "end-label", "start", "end"]);

export class DateRange extends HTMLElement {
    #span: HTMLSpanElement | null = null;
    #start: HTMLInputElement | null = null;
    #end: HTMLInputElement | null = null;

    connectedCallback(): void {
        if (this.#span) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "date-range");
        span.setAttribute("role", "group");
        const label = this.getAttribute("label");
        if (label !== null) span.setAttribute("aria-label", label);
        passThroughAttributes(this, span, HANDLED);

        const start = document.createElement("input");
        start.type = "date";
        const startLabel = this.getAttribute("start-label");
        if (startLabel !== null) start.setAttribute("aria-label", startLabel);
        start.value = this.getAttribute("start") ?? "";

        const end = document.createElement("input");
        end.type = "date";
        const endLabel = this.getAttribute("end-label");
        if (endLabel !== null) end.setAttribute("aria-label", endLabel);
        end.value = this.getAttribute("end") ?? "";

        span.appendChild(start);
        span.appendChild(end);

        this.appendChild(span);
        this.#span = span;
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
