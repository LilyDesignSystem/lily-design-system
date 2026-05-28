import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * CalendarTableRow — a calendar table interactive grid row for managing dates, days, etc. <tr>
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `calendar-table-row` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-calendar-table-row",
  standalone: true,
  template: `<tr class="calendar-table-row {{ className() }}"><ng-content /></tr>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarTableRow {
  readonly className = input<string>("");
}
