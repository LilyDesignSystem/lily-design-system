import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * GoToNextSection — a link that takes users to the next section of the current page
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `go-to-next-section` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-go-to-next-section",
    standalone: true,
    template: `<a class="go-to-next-section {{ className() }}" [attr.href]="href() || null" [attr.aria-label]="label() || null">{{ label() }}</a>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoToNextSection {
    /** Visible text and accessible name. */
    readonly label = input<string>("");
    /** The next section's fragment, for example "#results". */
    readonly href = input<string>("");
    readonly className = input<string>("");
}
