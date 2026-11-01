import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * GoToPreviousSection — a link that takes users to the previous section of the current page
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `go-to-previous-section` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-go-to-previous-section",
    standalone: true,
    template: `<a class="go-to-previous-section {{ className() }}" [attr.href]="href() || null" [attr.aria-label]="label() || null">{{ label() }}</a>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoToPreviousSection {
    /** Visible text and accessible name. */
    readonly label = input<string>("");
    /** The previous section's fragment, for example "#summary". */
    readonly href = input<string>("");
    readonly className = input<string>("");
}
