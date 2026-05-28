import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * CalendarRangePicker — a picker for selecting a date range on a calendar
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `calendar-range-picker` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-calendar-range-picker",
  standalone: true,
  template: `<div class="calendar-range-picker {{ className() }}" role="radiogroup" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarRangePicker {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
