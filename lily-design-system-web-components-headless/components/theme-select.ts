// ThemeSelect component
//
// A native <select> dropdown for choosing a theme. Children are typically
// ThemeSelectOption elements (or plain <option> elements). The component
// does not apply the theme — the consumer reacts to `value` changes.
//
// Timing note: ThemeSelectOption children upgrade via "upgrade in place"
// (see theme-select-option.ts) — they are not yet real <option> elements
// at the moment this component's own connectedCallback runs (custom
// element upgrade reactions for a parent always complete before its
// not-yet-upgraded children's reactions do, matching the same ordering
// BreadcrumbList relies on for BreadcrumbListItem). So an initial `value`
// attribute is applied twice: once synchronously (a no-op unless the
// children were already-real <option> elements) and once more from a
// queued microtask, by which point every nested ThemeSelectOption has
// finished replacing itself with a real <option> the browser can match.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — initial selected theme; also a live `value` property.
//   ...rest — spread onto the <select> (no `disabled`/`required` is
//     documented for this component specifically, but either still
//     works if passed through — the <select> just receives the attribute
//     as-is since neither name is in HANDLED below).
//
// References:
//   - components/theme-select/index.md (canonical contract)
//   - components/theme-select-option.ts (child upgrade timing)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value"]);

export class ThemeSelect extends HTMLElement {
    #select: HTMLSelectElement | null = null;

    connectedCallback(): void {
        if (this.#select) return;

        const select = document.createElement("select");
        select.className = rootClassName(this, "theme-select");
        const label = this.getAttribute("label");
        if (label !== null) select.setAttribute("aria-label", label);
        passThroughAttributes(this, select, HANDLED);

        moveChildrenInto(this, select);

        const value = this.getAttribute("value");
        if (value !== null) {
            select.value = value;
            queueMicrotask(() => {
                select.value = value;
            });
        }

        this.appendChild(select);
        this.#select = select;
    }

    get value(): string {
        return this.#select?.value ?? this.getAttribute("value") ?? "";
    }

    set value(v: string) {
        if (this.#select) this.#select.value = v;
        else this.setAttribute("value", v);
    }
}
