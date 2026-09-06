// CalendarRangePicker component
//
// A passive <div role="application"> container for calendar-based date
// range selection. The custom element stands in for the wrapper div
// directly (see lib/dom-utils.applySelfClassName) since <div> has no
// native behaviour worth preserving as a separate element. The consumer
// supplies the entire calendar grid (date cells, navigation controls,
// range highlighting) as light-DOM children and implements all
// selection logic; this component contributes only the container
// semantics and the accessible name.
//
// Attributes:
//   label — REQUIRED. Accessible name describing the picker purpose,
//     via aria-label.
//
// Keyboard: none — this is a passive element; the consumer implements
// date-cell navigation, selection, and range extension.
//
// References:
//   - components/calendar-range-picker/index.md (canonical contract)
//   - WAI-ARIA Application Role: https://www.w3.org/TR/wai-aria-1.2/#application

import { applySelfClassName } from "../lib/dom-utils.js";

export class CalendarRangePicker extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "calendar-range-picker");
        this.setAttribute("role", "application");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
    }
}
