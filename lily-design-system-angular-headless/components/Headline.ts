import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Headline — a page headline with heading, subtitle, and byline area
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `headline` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-headline",
    standalone: true,
    template: `<div class="headline {{ className() }}"><ng-content /></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Headline {
    readonly className = input<string>("");
}
