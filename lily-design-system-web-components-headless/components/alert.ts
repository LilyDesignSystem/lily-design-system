// Alert component
//
// A live-region <div> for status/error/warning/info messages. The custom
// element stands in for the wrapper div directly (see
// lib/dom-utils.applySelfClassName) since <div> has no native behaviour
// worth preserving as a separate element.
//
// Attributes:
//   type — "info" | "success" | "warning" | "error", default "info".
//     Exposed as data-type.
//   heading — optional; rendered in <p><strong>.
//   role — "alert" | "status", default "alert".
//   live — "assertive" | "polite" | "off"; overrides the role-derived
//     default (assertive for alert, polite for status).
//
// References:
//   - components/alert/index.md (canonical contract)

import { applySelfClassName } from "../lib/dom-utils.js";

export class Alert extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "alert");
        const role = this.getAttribute("role") ?? "alert";
        this.setAttribute("role", role);
        this.setAttribute("aria-atomic", "true");
        const live = this.getAttribute("live") ?? (role === "status" ? "polite" : "assertive");
        this.setAttribute("aria-live", live);
        this.setAttribute("data-type", this.getAttribute("type") ?? "info");

        const heading = this.getAttribute("heading");
        if (heading !== null) {
            const p = document.createElement("p");
            const strong = document.createElement("strong");
            strong.textContent = heading;
            p.appendChild(strong);
            this.insertBefore(p, this.firstChild);
        }
    }
}
