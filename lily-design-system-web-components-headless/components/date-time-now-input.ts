// DateTimeNowInput component
//
// A <div role="group"> wrapping a date input, a time input, and a "Now"
// button that sets both to the current local date and time. The custom
// element stands in for the wrapper div directly (see
// lib/dom-utils.applySelfClassName), and builds the three controls as
// its own children.
//
// Attributes:
//   label — REQUIRED. Accessible name for the group, via aria-label.
//   date-label — default "Date". Accessible name for the date input.
//   time-label — default "Time". Accessible name for the time input.
//   now-label — default "Now". Accessible name and visible text for the
//     "Now" button.
//   date-value — bindable date string (YYYY-MM-DD); also a live
//     `dateValue` property.
//   time-value — bindable time string (HH:mm); also a live `timeValue`
//     property.
//   required, disabled — presence-based booleans, applied to both
//     inputs (and, for disabled, the button too).
//
// Fires a bubbling, composed "lily-change" CustomEvent<{ dateValue:
// string, timeValue: string }> when the "Now" button sets both values.
//
// References:
//   - components/date-time-now-input/index.md (canonical contract)
//   - MDN date input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date
//   - MDN time input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time

import { applySelfClassName } from "../lib/dom-utils.js";

export class DateTimeNowInput extends HTMLElement {
    #built = false;
    #dateInput: HTMLInputElement | null = null;
    #timeInput: HTMLInputElement | null = null;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "date-time-now-input");
        this.setAttribute("role", "group");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);

        const disabled = this.hasAttribute("disabled");
        const required = this.hasAttribute("required");

        const dateInput = document.createElement("input");
        dateInput.type = "date";
        dateInput.setAttribute("aria-label", this.getAttribute("date-label") ?? "Date");
        dateInput.value = this.getAttribute("date-value") ?? "";
        dateInput.required = required;
        dateInput.disabled = disabled;
        dateInput.addEventListener("input", this.#onDateInput);
        this.#dateInput = dateInput;

        const timeInput = document.createElement("input");
        timeInput.type = "time";
        timeInput.setAttribute("aria-label", this.getAttribute("time-label") ?? "Time");
        timeInput.value = this.getAttribute("time-value") ?? "";
        timeInput.required = required;
        timeInput.disabled = disabled;
        timeInput.addEventListener("input", this.#onTimeInput);
        this.#timeInput = timeInput;

        const nowLabel = this.getAttribute("now-label") ?? "Now";
        const nowButton = document.createElement("button");
        nowButton.type = "button";
        nowButton.setAttribute("aria-label", nowLabel);
        nowButton.textContent = nowLabel;
        nowButton.disabled = disabled;
        nowButton.addEventListener("click", this.#onNow);

        this.appendChild(dateInput);
        this.appendChild(timeInput);
        this.appendChild(nowButton);
    }

    get dateValue(): string {
        return this.#dateInput?.value ?? this.getAttribute("date-value") ?? "";
    }

    set dateValue(v: string) {
        if (this.#dateInput) this.#dateInput.value = v;
        this.setAttribute("date-value", v);
    }

    get timeValue(): string {
        return this.#timeInput?.value ?? this.getAttribute("time-value") ?? "";
    }

    set timeValue(v: string) {
        if (this.#timeInput) this.#timeInput.value = v;
        this.setAttribute("time-value", v);
    }

    #onDateInput = (): void => {
        this.setAttribute("date-value", this.#dateInput!.value);
    };

    #onTimeInput = (): void => {
        this.setAttribute("time-value", this.#timeInput!.value);
    };

    #onNow = (): void => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const dateValue = `${year}-${month}-${day}`;
        const timeValue = `${hours}:${minutes}`;

        this.#dateInput!.value = dateValue;
        this.#timeInput!.value = timeValue;
        this.setAttribute("date-value", dateValue);
        this.setAttribute("time-value", timeValue);
        this.dispatchEvent(
            new CustomEvent("lily-change", { detail: { dateValue, timeValue }, bubbles: true, composed: true }),
        );
    };
}
