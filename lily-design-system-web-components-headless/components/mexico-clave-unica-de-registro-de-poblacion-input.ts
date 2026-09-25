// MexicoClaveUnicaDeRegistroDePoblacionInput component
//
// A headless input for entering Mexico's Clave Única de Registro de Población (CURP).
// Format: Eighteen-character alphanumeric code built from name, date of birth, sex, and state of
// birth: first letter of the first surname plus its first internal vowel; first letter of the
// second surname (or X if none); first letter of the given name; six-digit date of birth (YYMMDD);
// H or M for sex (X for non-binary); a two-letter state code (NE for those born abroad); a
// consonant from each surname and the given name; then two further disambiguating characters. No
// trailing check digit.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — initial value; also exposed as a live `value` property.
//   required, disabled — presence-based booleans.
//   ...rest — spread onto the <input> (except autocomplete, which this component
//     always forces to "off" to protect the sensitive identifier).
//
// References:
//   - components/mexico-clave-unica-de-registro-de-poblacion-input/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/Unique_Population_Registry_Code

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value", "required", "disabled", "autocomplete"]);

export class MexicoClaveUnicaDeRegistroDePoblacionInput extends HTMLElement {
    #input: HTMLInputElement | null = null;

    connectedCallback(): void {
        if (this.#input) return;

        const input = document.createElement("input");
        input.type = "text";
        input.className = rootClassName(this, "mexico-clave-unica-de-registro-de-poblacion-input");
        const label = this.getAttribute("label");
        if (label !== null) input.setAttribute("aria-label", label);
        input.value = this.getAttribute("value") ?? "";
        if (this.hasAttribute("required")) input.required = true;
        if (this.hasAttribute("disabled")) input.disabled = true;
        input.setAttribute("autocomplete", "off");
        passThroughAttributes(this, input, HANDLED);

        this.appendChild(input);
        this.#input = input;
    }

    get value(): string {
        return this.#input?.value ?? this.getAttribute("value") ?? "";
    }

    set value(v: string) {
        if (this.#input) this.#input.value = v;
        else this.setAttribute("value", v);
    }
}
