import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * AsSaudiyahRaqmAlHuwiyahAlWataniyahView — a read-only display of Saudi Arabia's National Identification Number
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `as-saudiyah-raqm-al-huwiyah-al-wataniyah-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-as-saudiyah-raqm-al-huwiyah-al-wataniyah-view",
    standalone: true,
    template: `<span class="as-saudiyah-raqm-al-huwiyah-al-wataniyah-view {{ className() }}" role="text" [attr.aria-label]="label() || null">{{ value() }}</span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsSaudiyahRaqmAlHuwiyahAlWataniyahView {
    /** Optional accessible label override (aria-label). */
    readonly label = input<string>("");
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    /** The value to display read-only. */
    readonly value = input<string>("");
}
