import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * PilipinasPhilhealthIdentificationNumberView — a read-only display of the Philippines's PhilHealth Identification Number (PIN)
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `pilipinas-philhealth-identification-number-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-pilipinas-philhealth-identification-number-view",
    standalone: true,
    template: `<span class="pilipinas-philhealth-identification-number-view {{ className() }}">@if (label()) {<span class="screen-reader-span">{{ label() + " " }}</span>}{{ value() }}</span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PilipinasPhilhealthIdentificationNumberView {
    /** Hidden text naming the value, for when no visible caption does. */
    readonly label = input<string>("");
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    /** The value to display read-only. */
    readonly value = input<string>("");
}
