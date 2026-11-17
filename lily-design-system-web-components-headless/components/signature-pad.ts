// SignaturePad component
//
// A signature, given by drawing or by typing a name, with the consumer's attestation and its outcome (spec/lessons/zoblocks
// item 6, tasks.md P31-T5). A named group, not role="application", so a screen reader keeps its own keys. The drawing
// surface is a native <canvas class="signature-pad-canvas"> inside; no drawing logic is implemented here (the consumer's,
// per the headless behaviour-boundary rule), and no hashing.
//
// Attributes:
//   label — REQUIRED. The group's accessible name.
//   attestation — what the signer confirms, in the consumer's words; shown first, and the group's description.
//   typed-name-label — adds a labelled typed-name field, so a signature can be given by keyboard alone (WCAG 2.1.1).
//   name — the typed-name field's form name.
//   outcome — signed, declined, unable, verbal, on-paper, pending or revoked; rendered as data-outcome.
//   outcome-label — the outcome in the consumer's words; required with outcome (a notice, never an empty line).
//
// References:
//   - components/signature-pad/index.md (canonical contract)

import { nextId, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set([
    "label",
    "attestation",
    "typed-name-label",
    "name",
    "outcome",
    "outcome-label",
]);

export class SignaturePad extends HTMLElement {
    #uid = nextId("lily-signature-pad");

    connectedCallback(): void {
        if (this.querySelector(":scope > div.signature-pad")) return;
        const attr = (name: string) => this.getAttribute(name) ?? "";
        const root = document.createElement("div");
        root.className = rootClassName(this, "signature-pad");
        root.setAttribute("role", "group");
        if (this.hasAttribute("label")) root.setAttribute("aria-label", attr("label"));
        if (attr("outcome")) root.setAttribute("data-outcome", attr("outcome"));
        passThroughAttributes(this, root, HANDLED);

        if (attr("attestation")) {
            const p = document.createElement("p");
            p.className = "signature-pad-attestation";
            p.id = `${this.#uid}-attestation`;
            p.textContent = attr("attestation");
            root.append(p);
            root.setAttribute("aria-describedby", p.id);
        }

        const canvas = document.createElement("canvas");
        canvas.className = "signature-pad-canvas";
        root.append(canvas);

        if (attr("typed-name-label")) {
            const p = document.createElement("p");
            p.className = "signature-pad-typed";
            const label = document.createElement("label");
            label.htmlFor = `${this.#uid}-typed`;
            label.textContent = attr("typed-name-label");
            const input = document.createElement("input");
            input.id = `${this.#uid}-typed`;
            input.type = "text";
            input.autocomplete = "name";
            if (attr("name")) input.name = attr("name");
            p.append(label, input);
            root.append(p);
        }

        if (attr("outcome") && attr("outcome-label")) {
            const p = document.createElement("p");
            p.className = "signature-pad-outcome";
            p.textContent = attr("outcome-label");
            root.append(p);
        }

        this.appendChild(root);
    }
}
