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
    template: `<article class="feature-card {{ className() }}" [attr.aria-label]="label() || heading() || null" [attr.data-image-position]="imagePosition()">
        @if (imageUrl()) {<img class="feature-card-image" [attr.src]="imageUrl()" [attr.alt]="imageAlt() ?? ''" />}
        <header class="feature-card-header"><h3 class="feature-card-heading">{{ heading() }}</h3></header>
        @if (description()) {<p class="feature-card-description">{{ description() }}</p>}
        <ng-content />
    </article>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureCard {
    readonly label = input<string>("");
    readonly className = input<string>("");
    /** Card title; also its name unless label is given. */
    readonly heading = input<string>("");
    /** Where the image sits, read by the consumer's CSS. */
    readonly imagePosition = input<"start" | "end" | "top">("start");
    /** Image address. */
    readonly imageUrl = input<string | undefined>(undefined);
    /** Text alternative of the image. */
    readonly imageAlt = input<string | undefined>(undefined);
    /** Summary. */
    readonly description = input<string | undefined>(undefined);
}
