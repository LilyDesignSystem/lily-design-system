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
    template: `<div class="watermark {{ className() }}"><ng-content /></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Watermark {
    readonly className = input<string>("");
}
