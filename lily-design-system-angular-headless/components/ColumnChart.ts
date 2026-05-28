import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ColumnChart — a vertical column chart visualization for displaying data
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `column-chart` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-column-chart",
  standalone: true,
  template: `<div class="column-chart {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnChart {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
