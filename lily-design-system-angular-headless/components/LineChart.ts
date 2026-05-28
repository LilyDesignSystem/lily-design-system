import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * LineChart — a line chart visualization connecting data points to display data
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `line-chart` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-line-chart",
  standalone: true,
  template: `<div class="line-chart {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineChart {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
