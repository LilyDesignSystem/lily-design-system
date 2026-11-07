import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Watermark — a decorative repeating overlay text or image marking a page
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `watermark` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-watermark",
    standalone: true,
    template: `<div class="watermark {{ className() }}" [attr.data-rotate]="rotate()" [attr.data-gap]="gap()"><div class="watermark-overlay" aria-hidden="true" [attr.data-text]="text() ?? null" [attr.data-image-url]="imageUrl() ?? null"></div><ng-content /></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Watermark {
    readonly className = input<string>("");
    /** Watermark text, read by the consumer's CSS. */
    readonly text = input<string | undefined>(undefined);
    /** Watermark image, read by the consumer's CSS. */
    readonly imageUrl = input<string | undefined>(undefined);
    /** Gap between repeats. */
    readonly gap = input<string>("100px");
    /** Rotation in degrees. */
    readonly rotate = input<number>(-22);
}
