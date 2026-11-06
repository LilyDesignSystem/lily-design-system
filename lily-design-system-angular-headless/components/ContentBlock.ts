import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ContentBlock — a content width constraint container with named column widths
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `content-block` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-content-block",
    standalone: true,
    template: `<div class="content-block {{ className() }}"><ng-content /></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentBlock {
    readonly className = input<string>("");
}
