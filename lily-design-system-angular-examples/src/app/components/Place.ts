import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Place — a place component that contains other place-related information
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `place` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-place",
    standalone: true,
    template: `<article class="place {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></article>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Place {
    readonly label = input<string>("");
    readonly className = input<string>("");
}
