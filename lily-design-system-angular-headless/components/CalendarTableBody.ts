import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * CalendarTableBody — a calendar table interactive grid tbody for managing dates, days, etc. <tbody>
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `calendar-table-body` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-calendar-table-body",
  standalone: true,
  template: `<tbody class="calendar-table-body {{ className() }}"><ng-content /></tbody>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarTableBody {
  readonly className = input<string>("");
}
