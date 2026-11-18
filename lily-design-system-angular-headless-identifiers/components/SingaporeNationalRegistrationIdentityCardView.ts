import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * SingaporeNationalRegistrationIdentityCardView — a read-only display of Singapore's National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN)
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `singapore-national-registration-identity-card-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-singapore-national-registration-identity-card-view",
    standalone: true,
    template: `<span class="singapore-national-registration-identity-card-view {{ className() }}">@if (label()) {<span class="screen-reader-span">{{ label() + " " }}</span>}{{ value() }}</span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingaporeNationalRegistrationIdentityCardView {
    /** Hidden text naming the value, for when no visible caption does. */
    readonly label = input<string>("");
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    /** The value to display read-only. */
    readonly value = input<string>("");
}
