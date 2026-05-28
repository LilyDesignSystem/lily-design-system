import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Tooltip — a small popup showing descriptive text on hover or focus
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `tooltip` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-tooltip",
  standalone: true,
  template: `<div class="tooltip {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tooltip {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
