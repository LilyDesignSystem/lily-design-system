import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * GoToTop — a link that returns users to the top of a long page
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `go-to-top` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-go-to-top",
    standalone: true,
    template: `<a class="go-to-top {{ className() }}" [attr.href]="href()" [attr.aria-label]="label() || null"><ng-content /></a>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoToTop {
    readonly label = input<string>("");
    /** Link target; the page's top anchor by default. */
    readonly href = input<string>("#top");
    readonly className = input<string>("");
}
