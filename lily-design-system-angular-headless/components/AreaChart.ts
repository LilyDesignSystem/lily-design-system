import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * AreaChart — an area chart visualization showing sized components in continuous data
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `area-chart` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-area-chart",
  standalone: true,
  template: `<div class="area-chart {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AreaChart {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
