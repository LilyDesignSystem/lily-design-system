import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * InformationCallout — a callout box highlighting informational content
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `information-callout` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-information-callout",
    standalone: true,
    template: `<aside class="information-callout {{ className() }}" role="note" [attr.aria-label]="label() || null"><ng-content /></aside>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InformationCallout {
    readonly label = input<string>("");
    readonly className = input<string>("");
}
