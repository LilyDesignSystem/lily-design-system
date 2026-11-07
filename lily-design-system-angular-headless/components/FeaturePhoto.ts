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
    template: `<figure class="feature-photo {{ className() }}" [attr.aria-label]="label() || null">
        <img class="feature-photo-image" [attr.src]="src() ?? null" [attr.alt]="alt()" [attr.loading]="loading()" [attr.width]="width() ?? null" [attr.height]="height() ?? null" />
        <figcaption class="feature-photo-caption">
            <span class="feature-photo-caption-text"><ng-content select="[caption]" /></span>
            <span class="feature-photo-credit"><ng-content select="[credit]" /></span>
        </figcaption>
    </figure>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturePhoto {
    readonly label = input<string>("");
    readonly className = input<string>("");
    /** Image address. */
    readonly src = input<string | undefined>(undefined);
    /** Text alternative of the image. */
    readonly alt = input<string>("");
    /** Loading strategy. */
    readonly loading = input<"lazy" | "eager">("lazy");
    /** Intrinsic width in pixels. */
    readonly width = input<number | undefined>(undefined);
    /** Intrinsic height in pixels. */
    readonly height = input<number | undefined>(undefined);
}
