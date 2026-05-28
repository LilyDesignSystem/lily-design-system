import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * CalendarTableFoot — a calendar table interactive grid tfoot for managing dates, days, etc. <tfoot>
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `calendar-table-foot` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-calendar-table-foot",
  standalone: true,
  template: `<tfoot class="calendar-table-foot {{ className() }}"><ng-content /></tfoot>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarTableFoot {
  readonly className = input<string>("");
}
