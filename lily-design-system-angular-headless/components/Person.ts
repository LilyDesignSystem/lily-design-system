import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Person — a person component that contains other person-related information
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `person` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-person",
    standalone: true,
    template: `<article class="person {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></article>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Person {
    readonly label = input<string>("");
    readonly className = input<string>("");
}
