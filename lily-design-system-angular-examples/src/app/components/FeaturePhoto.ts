import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * FeaturePhoto — a responsive photo with lazy loading and alt text validation
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `feature-photo` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-feature-photo",
  standalone: true,
  template: `<div class="feature-photo {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturePhoto {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
