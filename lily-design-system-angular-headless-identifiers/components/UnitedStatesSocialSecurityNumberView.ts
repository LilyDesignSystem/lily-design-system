import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * UnitedStatesSocialSecurityNumberView — a read-only display of a US Social Security number
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `united-states-social-security-number-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-united-states-social-security-number-view",
    standalone: true,
    template: `<span class="united-states-social-security-number-view {{ className() }}">@if (label()) {<span class="screen-reader-span">{{ label() + " " }}</span>}{{ value() }}</span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnitedStatesSocialSecurityNumberView {
    /** Hidden text naming the value, for when no visible caption does. */
    readonly label = input<string>("");
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    /** The value to display read-only. */
    readonly value = input<string>("");
}
