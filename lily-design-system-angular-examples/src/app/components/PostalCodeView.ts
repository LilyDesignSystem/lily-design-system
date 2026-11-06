import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * PostalCodeView — a read-only display of a postal or ZIP code
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `postal-code-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-postal-code-view",
    standalone: true,
    template: `<span class="postal-code-view {{ className() }}">{{ value() }}</span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostalCodeView {
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    /** The value to display read-only. */
    readonly value = input<string>("");
}
