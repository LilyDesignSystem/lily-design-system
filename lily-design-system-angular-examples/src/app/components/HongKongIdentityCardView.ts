import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * HongKongIdentityCardView — a read-only display of Hong Kong's Identity Card Number
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `hong-kong-identity-card-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-hong-kong-identity-card-view",
    standalone: true,
    template: `<span class="hong-kong-identity-card-view {{ className() }}">@if (label()) {<span class="screen-reader-span">{{ label() + " " }}</span>}{{ value() }}</span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HongKongIdentityCardView {
    /** Hidden text naming the value, for when no visible caption does. */
    readonly label = input<string>("");
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    /** The value to display read-only. */
    readonly value = input<string>("");
}
