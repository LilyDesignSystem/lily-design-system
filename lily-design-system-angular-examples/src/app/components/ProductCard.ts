import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ProductCard — a specialized card for displaying a product with image, title, price, and actions
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `product-card` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-product-card",
  standalone: true,
  template: `<div class="product-card {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCard {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
