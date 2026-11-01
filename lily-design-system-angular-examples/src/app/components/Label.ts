import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Label — a label associated with a form input
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `label` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-label",
    standalone: true,
    template: `<label class="label {{ className() }}" [attr.for]="for() || null"><ng-content /></label>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Label {
    /** The id of the control this label names. */
    readonly for = input<string>("");
    readonly className = input<string>("");
}
