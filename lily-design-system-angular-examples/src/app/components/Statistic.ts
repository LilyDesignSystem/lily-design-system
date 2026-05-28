import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Statistic — a numeric value display with title, prefix, and suffix
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `statistic` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-statistic",
  standalone: true,
  template: `<div class="statistic {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Statistic {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
