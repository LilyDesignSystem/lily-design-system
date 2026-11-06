import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * SummaryBox — a boxed callout highlighting key takeaways or next steps from a longer page
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `summary-box` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-summary-box",
    standalone: true,
    template: `<aside class="summary-box {{ className() }}" [attr.aria-label]="label() || heading() || null"><h3 class="summary-box-heading">{{ heading() }}</h3><div class="summary-box-body"><ng-content /></div></aside>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryBox {
    readonly label = input<string>("");
    readonly className = input<string>("");
    /** Title; also its name unless label is given. */
    readonly heading = input<string>("");
}
