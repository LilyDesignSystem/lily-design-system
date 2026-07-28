/*
    Example 2 — NHS Wales appointment booking.

    The shape this component was built for: a bilingual appointment
    booking, with a clinic that is shut at weekends and a booking window
    that only runs twelve weeks out.

    `locale` drives the month names, the first day of the week and the
    numeric field order — so switching to Welsh switches the calendar
    itself, not just the buttons around it.
*/
import { ChangeDetectionStrategy, Component, computed, signal } from "@angular/core";
import {
  DateTimePicker,
  addDays,
  weekdayOf,
  type DateTimePickerLabels,
  type DateTimeShortcut,
  type ShortcutEvent,
} from "../date-time-picker.component";

// A real service would take these from its translation bundle. They are
// inline here so the example is self-contained.
const EN: DateTimePickerLabels = {
  previousYear: "Previous year",
  previousMonth: "Previous month",
  nextMonth: "Next month",
  nextYear: "Next year",
  confirm: "Confirm",
  cancel: "Cancel",
  hour: "Hour",
  minute: "Minute",
  clear: "Clear",
};

const CY: DateTimePickerLabels = {
  previousYear: "Blwyddyn flaenorol",
  previousMonth: "Mis blaenorol",
  nextMonth: "Mis nesaf",
  nextYear: "Blwyddyn nesaf",
  confirm: "Cadarnhau",
  cancel: "Canslo",
  hour: "Awr",
  minute: "Munud",
  clear: "Clirio",
};

@Component({
  selector: "example-nhs-booking",
  standalone: true,
  imports: [DateTimePicker],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>{{ welsh() ? "Trefnu apwyntiad" : "Book an appointment" }}</h1>

    <button type="button" (click)="welsh.set(!welsh())">
      {{ welsh() ? "English" : "Cymraeg" }}
    </button>

    <label for="booking">
      {{
        welsh()
          ? "Dyddiad ac amser yr apwyntiad"
          : "Appointment date and time"
      }}
    </label>
    <div id="booking-hint">
      {{
        welsh()
          ? "Ar gael o ddydd Llun i ddydd Gwener, hyd at 12 wythnos ymlaen llaw."
          : "Available Monday to Friday, up to 12 weeks ahead."
      }}
    </div>

    <lily-date-time-picker
      mode="datetime"
      inputId="booking"
      describedBy="booking-hint"
      name="appointment"
      [label]="welsh() ? 'Dewiswch ddyddiad ac amser' : 'Choose a date and time'"
      [locale]="welsh() ? 'cy-GB' : 'en-GB'"
      [labels]="welsh() ? CY : EN"
      [min]="min"
      [max]="max"
      [isDateDisabled]="closed"
      [minuteStep]="15"
      [shortcuts]="shortcuts()"
      (shortcut)="onShortcut($event)"
      [(value)]="appointment"
    />

    <p>{{ welsh() ? "Gwerth" : "Value" }}: <code>{{ appointment || "—" }}</code></p>
  `,
})
export class NhsBookingExample {
  protected readonly EN = EN;
  protected readonly CY = CY;

  readonly welsh = signal(false);
  appointment = "";

  // Today is resolved once, at construction, so the booking window does
  // not shift under the user mid-session.
  private readonly todayIso = (() => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, "0");
    const d = String(today.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  })();

  // Bookable from tomorrow to twelve weeks out.
  readonly min = addDays(this.todayIso, 1);
  readonly max = addDays(this.todayIso, 7 * 12);

  // Weekends closed. A real service would also fold in bank holidays and
  // the clinic's own closures — which is exactly why this is a predicate
  // and not a list of inputs.
  protected readonly closed = (date: string): boolean =>
    weekdayOf(date) === 0 || weekdayOf(date) === 6;

  protected readonly shortcuts = computed<DateTimeShortcut[]>(() =>
    this.welsh()
      ? [
          { id: "1w", label: "Ymhen wythnos", days: 7 },
          { id: "2w", label: "Ymhen pythefnos", days: 14 },
          { id: "1m", label: "Ymhen mis", months: 1 },
        ]
      : [
          { id: "1w", label: "In 1 week", days: 7 },
          { id: "2w", label: "In 2 weeks", days: 14 },
          { id: "1m", label: "In 1 month", months: 1 },
        ],
  );

  protected onShortcut(event: ShortcutEvent): void {
    console.log("shortcut", event.id, event.isoDate);
  }
}
