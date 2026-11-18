import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * SriLankaNationalIdentityCardView — a read-only display of Sri Lanka's National Identity Card (NIC) number
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `sri-lanka-national-identity-card-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-sri-lanka-national-identity-card-view",
    standalone: true,
    template: `<span class="sri-lanka-national-identity-card-view {{ className() }}">@if (label()) {<span class="screen-reader-span">{{ label() + " " }}</span>}{{ value() }}</span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SriLankaNationalIdentityCardView {
    /** Hidden text naming the value, for when no visible caption does. */
    readonly label = input<string>("");
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    /** The value to display read-only. */
    readonly value = input<string>("");
}
