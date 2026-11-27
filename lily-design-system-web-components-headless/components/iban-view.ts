// IbanView component
//
// A headless read-only display of an International Bank Account Number (IBAN).
// Format: Up to 34 letters and digits: a two-letter country code, two check digits, then the national account number.
//
// Attributes:
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//
// References:
//   - components/iban-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/International_Bank_Account_Number
import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";
import { LiveElement, part } from "../lib/live-element.js";

const HANDLED = new Set(["label", "value"]);

// A change to label, value or class is shown (tasks.md P50-T28).
export class IbanView extends LiveElement {
    static get observedAttributes(): string[] {
        return [...HANDLED, "class"];
    }

    protected update(): void {
        const existing = this.querySelector<HTMLSpanElement>(":scope > span.iban-view");
        const span = existing ?? document.createElement("span");
        span.className = rootClassName(this, "iban-view");
        const value = this.text("value");
        span.replaceChildren();
        if (this.text("label")) span.append(part("screen-reader-span", `${this.text("label")} `));
        span.append(value);
        if (existing) return;
        passThroughAttributes(this, span, HANDLED);
        this.appendChild(span);
    }

    get value(): string {
        return this.text("value");
    }

    set value(v: string) {
        this.setAttribute("value", v);
        this.flush();
    }
}
