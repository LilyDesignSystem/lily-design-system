import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ScatterChart — a scatter chart visualization using dots to display data
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `scatter-chart` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-scatter-chart",
  standalone: true,
  template: `<div class="scatter-chart {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScatterChart {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
