// CharacterCounter component
//
// A counter showing remaining or used characters in a text field. Renders
// a <span> whose data attributes, visible count and delayed status are
// derived from the `count` and `max` attributes.
//
// Attributes:
//   count — number, default 0. Current character count.
//   max — number, optional. Maximum allowed characters; when provided,
//     enables remaining/over-limit tracking.
//   announce-delay — number, default 1000. Milliseconds of quiet before the status takes the new count.
//   label — optional. Accessible label via aria-label.
//
// References:
//   - components/character-counter/index.md (canonical contract)

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["count", "max", "label", "announce-delay"]);

// The visible count (.character-counter-text) is aria-hidden; a visually hidden role="status" (.character-counter-status,
// also .screen-reader-span) takes the same text once the count has stopped changing for `announce-delay` ms (default
// 1000), so a run of keystrokes is announced once, as GOV.UK's character count does. `label` names the status.

export class CharacterCounter extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["count", "max", "label", "announce-delay"];
    }

    #span: HTMLSpanElement | null = null;
    #text: HTMLSpanElement | null = null;
    #status: HTMLSpanElement | null = null;
    #timer: ReturnType<typeof setTimeout> | undefined;

    connectedCallback(): void {
        if (!this.#span) {
            const span = document.createElement("span");
            span.className = rootClassName(this, "character-counter");
            passThroughAttributes(this, span, HANDLED);
            const text = document.createElement("span");
            text.className = "character-counter-text";
            text.setAttribute("aria-hidden", "true");
            const status = document.createElement("span");
            status.className = "character-counter-status screen-reader-span";
            status.setAttribute("role", "status");
            span.append(text, status);
            this.appendChild(span);
            this.#span = span;
            this.#text = text;
            this.#status = status;
        }
        this.#sync();
        // The first text is the status's at once.
        if (this.#status && this.#text && !this.#status.textContent)
            this.#status.textContent = this.#text.textContent;
    }

    disconnectedCallback(): void {
        clearTimeout(this.#timer);
    }

    attributeChangedCallback(): void {
        this.#sync();
    }

    #sync(): void {
        const span = this.#span;
        const text = this.#text;
        const status = this.#status;
        if (!span || !text || !status) return;

        const count = Number(this.getAttribute("count") ?? "0");
        const maxAttr = this.getAttribute("max");
        const label = this.getAttribute("label");

        if (label !== null) status.setAttribute("aria-label", label);
        else status.removeAttribute("aria-label");

        span.setAttribute("data-count", String(count));

        if (maxAttr !== null) {
            const max = Number(maxAttr);
            const remaining = max - count;
            const overLimit = count > max;
            text.textContent = `${count} / ${max}`;
            span.setAttribute("data-max", String(max));
            span.setAttribute("data-remaining", String(remaining));
            if (overLimit) span.setAttribute("data-over-limit", "true");
            else span.removeAttribute("data-over-limit");
        } else {
            text.textContent = String(count);
            span.removeAttribute("data-max");
            span.removeAttribute("data-remaining");
            span.removeAttribute("data-over-limit");
        }

        // The status takes the text only after announce-delay ms of quiet.
        clearTimeout(this.#timer);
        const next = text.textContent;
        if (status.textContent && status.textContent !== next)
            this.#timer = setTimeout(
                () => (status.textContent = next),
                Number(this.getAttribute("announce-delay") ?? 1000),
            );
    }
}
