// RedAmberGreenPicker component
//
// A passive <div role="radiogroup"> container for a red/amber/green
// status choice. The custom element stands in for the wrapper div
// directly (see lib/dom-utils.applySelfClassName) since <div> has no
// native behaviour worth preserving as a separate element.
//
// KNOWN, STILL-OPEN CATALOG-WIDE DOCUMENTATION DEFECT (see
// spec/headless/index.md at the monorepo root): this component's own
// components/red-amber-green-picker/AGENTS.md states "HTML tag: <div>"
// in its Metadata while its own Key Behaviors section describes a
// rendered `<select>` — a genuine internal self-contradiction, not
// introduced here. The seven full-catalog headless libraries also
// disagree with each other: react/svelte/vue render a native `<select>`
// with hardcoded "Red"/"Amber"/"Green" option text (itself a violation
// of the no-hardcoded-user-facing-strings rule, flagged in react's own
// header comment); angular/blazor/nunjucks render a passive `<div
// role="radiogroup">` whose red/amber/green options are separate
// RedAmberGreenPickerButton instances the CONSUMER composes in — with
// no hardcoded option text at all.
//
// This implementation deliberately follows the angular/blazor/nunjucks
// shape: a `<select>` cannot render the coloured-swatch-per-option
// visual this picker family is named for anyway (and this headless
// layer renders no colour regardless — that is the example layer's
// job), so a real radiogroup of consumer-labelled buttons is the more
// defensible headless contract, and it is also the majority choice
// across the seven catalogs. Flagged here for a future catalog-wide
// resolution, per the task that produced this file.
//
// Attributes:
//   label — REQUIRED. Accessible label for the radiogroup, via
//     aria-label.
//
// Keyboard: none built in — native <button> focus/activation on the
// consumer-supplied RedAmberGreenPickerButton children handles
// Tab/Enter/Space; this container adds no keydown handling of its own.
//
// References:
//   - components/red-amber-green-picker/index.md (canonical contract)
//   - RAG Status: https://en.wikipedia.org/wiki/Traffic_light_rating_system

import { applySelfClassName } from "../lib/dom-utils.js";

export class RedAmberGreenPicker extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "red-amber-green-picker");
        this.setAttribute("role", "radiogroup");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
    }
}
