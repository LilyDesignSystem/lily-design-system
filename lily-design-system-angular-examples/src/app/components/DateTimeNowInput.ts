import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";
import { restoreOnFormReset } from "./form-reset";

/**
 * DateTimeNowInput — a date and time input pair with a "Now" button that fills both
 *
 * Headless Angular component. A labelled `role="group"` `<div>` holding an
 * `<input type="date">`, an `<input type="time">` and a button that sets both to the
 * current local date and time. Both values are two-way (`[(dateValue)]`,
 * `[(timeValue)]`) and go back to their first values on form reset. Ships zero CSS.
 *
 * The three control names have no default (no English from us): take them from the
 * locale-translations packs, `dateTimeNowInputLabels(pack)` in
 * `@lilydesignsystem/angular-locale-translations`.
 */
@Component({
    selector: "lily-date-time-now-input",
    standalone: true,
    template: `<div class="date-time-now-input {{ className() }}" role="group" [attr.aria-label]="label()">
        <input
            type="date"
            [attr.aria-label]="dateLabel()"
            [value]="dateValue()"
            (input)="dateValue.set($any($event.target).value)"
            [required]="required()"
            [disabled]="disabled()"
        />
        <input
            type="time"
            [attr.aria-label]="timeLabel()"
            [value]="timeValue()"
            (input)="timeValue.set($any($event.target).value)"
            [required]="required()"
            [disabled]="disabled()"
        />
        <button type="button" [attr.aria-label]="nowLabel()" [disabled]="disabled()" (click)="setNow()">
            {{ nowLabel() }}
        </button>
    </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateTimeNowInput {
    /** Accessible name for the group (required). */
    readonly label = input.required<string>();
    /** Accessible name of the date input (required; dateTimeNowInputLabels(pack) gives all three). */
    readonly dateLabel = input.required<string>();
    /** Accessible name of the time input (required). */
    readonly timeLabel = input.required<string>();
    /** Text and accessible name of the Now button (required). */
    readonly nowLabel = input.required<string>();
    /** The date, YYYY-MM-DD (two-way). */
    readonly dateValue = model<string>("");
    /** The time, HH:MM (two-way). */
    readonly timeValue = model<string>("");
    /** Whether both inputs are required for form submission. */
    readonly required = input<boolean>(false);
    /** Disables both inputs and the button. */
    readonly disabled = input<boolean>(false);
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");

    constructor() {
        restoreOnFormReset(this.dateValue, 0);
        restoreOnFormReset(this.timeValue, 1);
    }

    setNow(): void {
        const now = new Date();
        const pad = (n: number) => String(n).padStart(2, "0");
        this.dateValue.set(`${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`);
        this.timeValue.set(`${pad(now.getHours())}:${pad(now.getMinutes())}`);
    }
}
