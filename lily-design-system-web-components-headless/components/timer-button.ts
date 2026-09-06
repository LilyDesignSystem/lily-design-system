// TimerButton component
//
// A native <button> with a countdown timer that automatically activates
// when it reaches zero. Renders a real <button> element (pattern 1); the
// consumer's light-DOM children become the button's visible label content.
//
// Attributes:
//   label — REQUIRED. Accessible name describing the action, via
//     aria-label.
//   duration — REQUIRED. Countdown duration in seconds.
//   disabled — presence-based boolean.
//
// Exposes the remaining time as data-remaining-seconds so consumer CSS/JS
// can render a live countdown. A manual click activates immediately;
// reaching zero activates automatically. Either path fires a bubbling,
// composed "lily-activate" CustomEvent exactly once.
//
// References:
//   - components/timer-button/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "disabled", "duration"]);

export class TimerButton extends HTMLElement {
    #button: HTMLButtonElement | null = null;
    #remaining = 0;
    #interval: ReturnType<typeof setInterval> | null = null;
    #activated = false;

    connectedCallback(): void {
        if (this.#button) return;

        const button = document.createElement("button");
        button.type = "button";
        button.className = rootClassName(this, "timer-button");
        const label = this.getAttribute("label");
        if (label !== null) button.setAttribute("aria-label", label);
        if (this.hasAttribute("disabled")) button.disabled = true;
        this.#remaining = Number(this.getAttribute("duration") ?? "0");
        button.setAttribute("data-remaining-seconds", String(this.#remaining));
        passThroughAttributes(this, button, HANDLED);
        button.addEventListener("click", this.#onClick);

        moveChildrenInto(this, button);
        this.appendChild(button);
        this.#button = button;
        this.#startTimer();
    }

    disconnectedCallback(): void {
        if (this.#interval !== null) clearInterval(this.#interval);
    }

    get remainingSeconds(): number {
        return this.#remaining;
    }

    #startTimer(): void {
        if (this.#remaining <= 0) return;
        this.#interval = setInterval(() => {
            this.#remaining = Math.max(0, this.#remaining - 1);
            this.#button?.setAttribute("data-remaining-seconds", String(this.#remaining));
            if (this.#remaining <= 0) {
                if (this.#interval !== null) clearInterval(this.#interval);
                this.#interval = null;
                this.#activate();
            }
        }, 1000);
    }

    #onClick = (): void => {
        this.#activate();
    };

    #activate(): void {
        if (this.#activated) return;
        this.#activated = true;
        if (this.#interval !== null) {
            clearInterval(this.#interval);
            this.#interval = null;
        }
        this.dispatchEvent(new CustomEvent("lily-activate", { bubbles: true, composed: true }));
    }
}
