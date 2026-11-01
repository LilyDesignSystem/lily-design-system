import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * DateTimeView — a read-only display of a formatted date and time
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `date-time-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-date-time-view",
    standalone: true,
    template: `<time class="date-time-view {{ className() }}" [attr.datetime]="value() || null" [attr.aria-label]="label() || null">{{ format() || value() }}</time>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateTimeView {
    /** Optional accessible label override (aria-label). */
    readonly label = input<string>("");
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    /** The machine-readable date-time (ISO 8601), written to datetime and shown when format is unset. */
    readonly value = input<string>("");
    /** The consumer-formatted text to show, for example from Intl.DateTimeFormat. */
    readonly format = input<string>("");
}
