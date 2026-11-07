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
    template: `<article class="product-card {{ className() }}" [attr.aria-label]="label() || name() || null">
        @if (imageUrl()) {<img class="product-card-image" [attr.src]="imageUrl()" [attr.alt]="imageAlt() ?? ''" />}
        <header class="product-card-header">
            <h3 class="product-card-name">{{ name() }}</h3>
            <p class="product-card-price">{{ price() }}</p>
        </header>
        <ng-content />
    </article>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCard {
    readonly label = input<string>("");
    readonly className = input<string>("");
    /** Product name; also its name unless label is given. */
    readonly name = input<string>("");
    /** Formatted price, supplied by the consumer. */
    readonly price = input<string>("");
    /** Image address. */
    readonly imageUrl = input<string | undefined>(undefined);
    /** Text alternative of the image. */
    readonly imageAlt = input<string | undefined>(undefined);
}
