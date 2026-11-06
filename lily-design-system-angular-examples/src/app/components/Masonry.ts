import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Masonry — a masonry layout container for variable-height items
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `masonry` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-masonry",
    standalone: true,
    template: `<div class="masonry {{ className() }}"><ng-content /></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Masonry {
    readonly className = input<string>("");
}
