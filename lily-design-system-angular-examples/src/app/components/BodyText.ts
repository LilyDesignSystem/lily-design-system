import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * BodyText — a rendered text block within a content width container
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `body-text` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-body-text",
    standalone: true,
    template: `<div class="body-text {{ className() }}"><ng-content /></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BodyText {
    readonly className = input<string>("");
}
