import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * FeatureCard — a large content card with a prominent image positioned alongside or above the text
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `feature-card` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-feature-card",
  standalone: true,
  template: `<div class="feature-card {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureCard {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
