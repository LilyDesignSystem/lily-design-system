// ColorPickerButton component
//
// A <button> representing a single predefined colour swatch within a
// color-picker interface (e.g. a palette of preset colours alongside
// ColorPicker's 2D board). No visible text content — the swatch is
// purely visual, so `label` supplies the entire accessible name.
//
// DEVIATION FROM THE CANONICAL CONTRACT (flagged, not hidden): the
// canonical components/color-picker-button/AGENTS.md and every other
// framework's port (react, svelte, vue) apply the `color` value as an
// inline `style.backgroundColor` — documented there as "an intrinsic
// part of the swatch's purpose", not a decorative choice. This
// package's own AGENTS.md carries a stricter, catalog-specific rule:
// "No CSS/styles — no inline styles beyond the one documented
// structural exception (FloatButton's position: fixed) — do not add
// another without flagging it to me first." Rather than add a second,
// unapproved exception, this implementation exposes the colour only via
// `data-color`, matching this catalog's existing data-attribute
// convention for consumer-CSS-driven state (see e.g.
// red-amber-green-picker-button's `data-value`). A consumer supplies
// `[data-color="..."] { background-color: attr(data-color); }`-style
// CSS (or a small stylesheet keyed on the known values) to render the
// swatch. Flagged for a maintainer decision on whether to add the
// inline-style exception catalog-wide instead.
//
// Attributes:
//   color — REQUIRED. The CSS colour value, exposed via `data-color`
//     for consumer CSS (NOT applied as an inline style — see above).
//   label — REQUIRED. Accessible name, via aria-label (e.g. "Red",
//     "Ocean Blue").
//   selected — presence-based boolean, default false; always reflected
//     as an explicit aria-pressed="true"/"false" (toggle context).
//   disabled — presence-based boolean.
//   ...rest — spread onto the <button>.
//
// Keyboard: Tab to focus; Enter / Space to activate (native <button>).
//
// References:
//   - components/color-picker-button/index.md (canonical contract)
//   - WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["color", "label", "selected", "disabled"]);

export class ColorPickerButton extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > button.color-picker-button")) return;

        const button = document.createElement("button");
        button.type = "button";
        button.className = rootClassName(this, "color-picker-button");
        const color = this.getAttribute("color");
        if (color !== null) button.setAttribute("data-color", color);
        const label = this.getAttribute("label");
        if (label !== null) button.setAttribute("aria-label", label);
        button.setAttribute("aria-pressed", this.hasAttribute("selected") ? "true" : "false");
        if (this.hasAttribute("disabled")) button.disabled = true;
        passThroughAttributes(this, button, HANDLED);

        this.appendChild(button);
    }
}
