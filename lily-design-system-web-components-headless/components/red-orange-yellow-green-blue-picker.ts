// RedOrangeYellowGreenBluePicker component
//
// A passive <div role="radiogroup"> container for a five-level colour
// status choice. The custom element stands in for the wrapper div
// directly (see lib/dom-utils.applySelfClassName) since <div> has no
// native behaviour worth preserving as a separate element.
//
// KNOWN, STILL-OPEN CATALOG-WIDE DOCUMENTATION DEFECT (see
// spec/headless/index.md at the monorepo root, and
// red-amber-green-picker.ts's header comment for the full reasoning,
// which applies identically here): this component's own
// components/red-orange-yellow-green-blue-picker/AGENTS.md states "HTML
// tag: <div>" in its Metadata while its own Key Behaviors section
// describes a rendered `<select>` — a genuine internal
// self-contradiction, not introduced here, and the seven full-catalog
// headless libraries disagree with each other the same way
// red-amber-green-picker's do (react/svelte/vue: `<select>` with
// hardcoded option text; angular/blazor/nunjucks: passive `<div
// role="radiogroup">` with consumer-composed PickerButton children).
//
// This implementation follows the angular/blazor/nunjucks shape for the
// same reasons: a `<select>` cannot render the coloured-swatch-per-
// option visual this picker family is named for, this headless layer
// renders no colour regardless, and it is the majority choice across
// the seven catalogs. Flagged here for a future catalog-wide
// resolution.
//
// Attributes:
//   label — REQUIRED. Accessible label for the radiogroup, via
//     aria-label.
//
// Keyboard: none built in — native <button> focus/activation on the
// consumer-supplied RedOrangeYellowGreenBluePickerButton children
// handles Tab/Enter/Space; this container adds no keydown handling of
// its own.
//
// References:
//   - components/red-orange-yellow-green-blue-picker/index.md (canonical contract)
//   - Traffic Light Rating System: https://en.wikipedia.org/wiki/Traffic_light_rating_system

import { applySelfClassName } from "../lib/dom-utils.js";

export class RedOrangeYellowGreenBluePicker extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "red-orange-yellow-green-blue-picker");
        this.setAttribute("role", "radiogroup");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
    }
}
