import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Hint — hint text providing guidance for a form field
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `hint` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-hint",
    standalone: true,
    template: `<div class="hint {{ className() }}"><ng-content /></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hint {
    readonly className = input<string>("");
}
