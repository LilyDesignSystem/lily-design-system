import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * BarChart — a horizontal bar chart visualization for displaying data
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `bar-chart` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-bar-chart",
  standalone: true,
  template: `<div class="bar-chart {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarChart {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
