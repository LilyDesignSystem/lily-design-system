import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * CalendarTableTH — a calendar table interactive grid header cell for managing dates, days, etc. <th>
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `calendar-table-th` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-calendar-table-th",
  standalone: true,
  template: `<th class="calendar-table-th {{ className() }}" [attr.scope]="scope() || null"><ng-content /></th>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarTableTH {
  readonly scope = input<string>("");
  readonly className = input<string>("");
}
