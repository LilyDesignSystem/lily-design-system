// ZhongguoJuminShenfenzhengHaomaView component
//
// A headless read-only display of China's Resident Identity Card Number (居民身份证号码).
// Format: Eighteen characters (GB 11643): region, date of birth, sequence with sex parity, then an ISO 7064 MOD 11-2 check character (may be X).
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   value — the identifier string to display, as text content.
//   ...rest — spread onto the <span>.
//   role="text" — the identifier announces as a single unit, not broken into words/chunks.
//
// References:
//   - components/zhongguo-jumin-shenfenzheng-haoma-view/index.md (canonical contract)
//   - https://en.wikipedia.org/wiki/Resident_Identity_Card

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "value"]);

export class ZhongguoJuminShenfenzhengHaomaView extends HTMLElement {
    #span: HTMLSpanElement | null = null;

    connectedCallback(): void {
        if (this.#span) return;

        const span = document.createElement("span");
        span.className = rootClassName(this, "zhongguo-jumin-shenfenzheng-haoma-view");
        const label = this.getAttribute("label");
        if (label !== null) span.setAttribute("aria-label", label);
        span.textContent = this.getAttribute("value") ?? "";
        span.setAttribute("role", "text");
        passThroughAttributes(this, span, HANDLED);

        this.appendChild(span);
        this.#span = span;
    }

    get value(): string {
        return this.#span?.textContent ?? this.getAttribute("value") ?? "";
    }

    set value(v: string) {
        if (this.#span) this.#span.textContent = v;
        else this.setAttribute("value", v);
    }
}
