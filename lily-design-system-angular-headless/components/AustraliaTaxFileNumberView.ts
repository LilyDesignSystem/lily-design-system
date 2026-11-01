import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * AustraliaTaxFileNumberView — a read-only display of Australia's Tax File Number (TFN)
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `australia-tax-file-number-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-australia-tax-file-number-view",
    standalone: true,
    template: `<span class="australia-tax-file-number-view {{ className() }}" role="text" [attr.aria-label]="label() || null">{{ value() }}</span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AustraliaTaxFileNumberView {
    /** Optional accessible label override (aria-label). */
    readonly label = input<string>("");
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    /** The value to display read-only. */
    readonly value = input<string>("");
}
