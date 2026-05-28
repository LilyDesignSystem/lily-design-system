import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Visible — an IntersectionObserver wrapper that exposes element visibility state
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `visible` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-visible",
  standalone: true,
  template: `<div class="visible {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Visible {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
