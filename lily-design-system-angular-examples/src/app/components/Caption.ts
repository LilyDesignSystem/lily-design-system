import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Caption — a caption for a table or figure element
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `caption` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-caption",
    standalone: true,
    template: `<figcaption class="caption {{ className() }}"><ng-content /></figcaption>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Caption {
    readonly className = input<string>("");
}
