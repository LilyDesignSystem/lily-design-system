import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * CalendarTable — a calendar table interactive grid for managing dates, days, etc. <table>
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `calendar-table` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-calendar-table",
  standalone: true,
  template: `<table class="calendar-table {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></table>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarTable {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
