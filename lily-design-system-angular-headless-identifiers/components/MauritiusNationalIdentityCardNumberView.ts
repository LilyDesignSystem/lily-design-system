import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * MauritiusNationalIdentityCardNumberView — a read-only display of Mauritius's National Identity Card number
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `mauritius-national-identity-card-number-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-mauritius-national-identity-card-number-view",
    standalone: true,
    template: `<span class="mauritius-national-identity-card-number-view {{ className() }}">@if (label()) {<span class="screen-reader-span">{{ label() + " " }}</span>}{{ value() }}</span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MauritiusNationalIdentityCardNumberView {
    /** Hidden text naming the value, for when no visible caption does. */
    readonly label = input<string>("");
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    /** The value to display read-only. */
    readonly value = input<string>("");
}
