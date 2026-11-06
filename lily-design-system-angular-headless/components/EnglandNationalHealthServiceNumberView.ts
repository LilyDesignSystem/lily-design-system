import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * EnglandNationalHealthServiceNumberView — a read-only display of England's National Health Service Number (NHS)
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `england-national-health-service-number-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-england-national-health-service-number-view",
    standalone: true,
    template: `<span class="england-national-health-service-number-view {{ className() }}">@if (label()) {<span class="screen-reader-span">{{ label() + " " }}</span>}{{ value() }}</span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnglandNationalHealthServiceNumberView {
    /** Hidden text naming the value, for when no visible caption does. */
    readonly label = input<string>("");
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    /** The value to display read-only. */
    readonly value = input<string>("");
}
