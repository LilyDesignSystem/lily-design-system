import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Details — a disclosure widget that shows and hides content
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `details` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-details",
  standalone: true,
  template: `<div class="details {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Details {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
