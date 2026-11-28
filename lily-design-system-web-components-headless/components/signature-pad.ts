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
import { setOrRemove } from "../lib/live-element.js";

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
    #attestation: HTMLParagraphElement | null = null;
    #canvas: HTMLCanvasElement | null = null;
    #typed: HTMLParagraphElement | null = null;
    #outcome: HTMLParagraphElement | null = null;

    // A change to any attribute is shown (tasks.md P50-T28): the attestation, the typed-name field and the outcome come and go
    // with their attributes. The canvas, and so the signature drawn on it, and a typed name stay.
    static get observedAttributes(): string[] {
        return [...HANDLED, "class"];
    }

    attributeChangedCallback(): void {
        const root = this.querySelector<HTMLElement>(":scope > div.signature-pad");
        if (root) this.#apply(root);
    }

    connectedCallback(): void {
        if (this.querySelector(":scope > div.signature-pad")) return;
        const root = document.createElement("div");
        root.setAttribute("role", "group");
        passThroughAttributes(this, root, HANDLED);
        this.#canvas = document.createElement("canvas");
        this.#canvas.className = "signature-pad-canvas";
        root.append(this.#canvas);
        this.#apply(root);
        this.appendChild(root);
    }

    #apply(root: HTMLElement): void {
        const attr = (name: string) => this.getAttribute(name) ?? "";
        root.className = rootClassName(this, "signature-pad");
        setOrRemove(root, "aria-label", this.getAttribute("label"));
        setOrRemove(root, "data-outcome", attr("outcome"));

        if (attr("attestation")) {
            if (!this.#attestation) {
                this.#attestation = document.createElement("p");
                this.#attestation.className = "signature-pad-attestation";
                this.#attestation.id = `${this.#uid}-attestation`;
                root.prepend(this.#attestation);
            }
            this.#attestation.textContent = attr("attestation");
            root.setAttribute("aria-describedby", this.#attestation.id);
        } else {
            this.#attestation?.remove();
            this.#attestation = null;
            root.removeAttribute("aria-describedby");
        }

        if (attr("typed-name-label")) {
            if (!this.#typed) {
                this.#typed = document.createElement("p");
                this.#typed.className = "signature-pad-typed";
                const label = document.createElement("label");
                label.htmlFor = `${this.#uid}-typed`;
                const input = document.createElement("input");
                input.id = `${this.#uid}-typed`;
                input.type = "text";
                input.autocomplete = "name";
                this.#typed.append(label, input);
                this.#canvas?.after(this.#typed);
            }
            const [label, input] = Array.from(this.#typed.children) as [
                HTMLLabelElement,
                HTMLInputElement,
            ];
            label.textContent = attr("typed-name-label");
            setOrRemove(input, "name", attr("name"));
        } else {
            this.#typed?.remove();
            this.#typed = null;
        }

        if (attr("outcome") && attr("outcome-label")) {
            if (!this.#outcome) {
                this.#outcome = document.createElement("p");
                this.#outcome.className = "signature-pad-outcome";
                root.append(this.#outcome);
            }
            this.#outcome.textContent = attr("outcome-label");
        } else {
            this.#outcome?.remove();
            this.#outcome = null;
        }
    }
}
