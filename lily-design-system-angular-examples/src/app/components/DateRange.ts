import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * DateRange — a display of a start and end date range
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `date-range` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-date-range",
  standalone: true,
  template: `<div class="date-range {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateRange {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
