/*
    Example 1 — Basic usage.

    The smallest useful call site: a labelled field, a locale, and the six
    required strings. `[(value)]` is Angular's two-way binding sugar for
    the `value` model() input — it desugars to `[value]="appointment"
    (valueChange)="appointment = $event"`.

    This package ships zero CSS, and so does this example, per the
    catalog's template-inline-only / no-styles convention. Without your
    own `position: relative` on .date-time-picker and `position: absolute`
    on .date-time-picker-dialog, the open dialog pushes page content down
    instead of overlaying it — see ../docs/accessibility.md and
    ../index.md "You must supply the CSS".
*/
import { ChangeDetectionStrategy, Component } from "@angular/core";
import {
  DateTimePicker,
  type DateTimePickerLabels,
} from "../date-time-picker.component";

@Component({
  selector: "example-basic",
  standalone: true,
  imports: [DateTimePicker],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>Date picker — basic</h1>

    <label for="appointment">Appointment date</label>
    <div id="appointment-hint">For example, 27 Jun 2026</div>

    <lily-date-time-picker
      inputId="appointment"
      describedBy="appointment-hint"
      name="appointment"
      label="Choose an appointment date"
      locale="en-GB"
      placeholder="DD MMM YYYY"
      [(value)]="appointment"
      [labels]="labels"
    />

    <p>
      Value posted to the server: <code>{{ appointment || "(empty)" }}</code>
    </p>
  `,
})
export class BasicExample {
  appointment = "";

  readonly labels: DateTimePickerLabels = {
    previousYear: "Previous year",
    previousMonth: "Previous month",
    nextMonth: "Next month",
    nextYear: "Next year",
    confirm: "OK",
    cancel: "Cancel",
  };
}
