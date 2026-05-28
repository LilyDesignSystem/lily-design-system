import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * StickyPromoBanner — a fixed-position promotional banner with a dismiss button
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `sticky-promo-banner` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-sticky-promo-banner",
  standalone: true,
  template: `<div class="sticky-promo-banner {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StickyPromoBanner {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
