import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * CalendarTableTD — a calendar table interactive grid data cell for managing dates, days, etc. <td>
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `calendar-table-td` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-calendar-table-td",
  standalone: true,
  template: `<td class="calendar-table-td {{ className() }}"><ng-content /></td>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarTableTD {
  readonly className = input<string>("");
}
