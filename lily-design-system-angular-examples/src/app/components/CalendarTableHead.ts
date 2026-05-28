import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * CalendarTableHead — a calendar table interactive grid thead for managing dates, days, etc. <thead>
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `calendar-table-head` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-calendar-table-head",
  standalone: true,
  template: `<thead class="calendar-table-head {{ className() }}"><ng-content /></thead>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarTableHead {
  readonly className = input<string>("");
}
