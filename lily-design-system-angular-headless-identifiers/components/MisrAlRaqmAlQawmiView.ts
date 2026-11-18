import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * MisrAlRaqmAlQawmiView — a read-only display of Egypt's الرقم القومي (National Number)
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `misr-al-raqm-al-qawmi-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-misr-al-raqm-al-qawmi-view",
    standalone: true,
    template: `<span class="misr-al-raqm-al-qawmi-view {{ className() }}">@if (label()) {<span class="screen-reader-span">{{ label() + " " }}</span>}{{ value() }}</span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MisrAlRaqmAlQawmiView {
    /** Hidden text naming the value, for when no visible caption does. */
    readonly label = input<string>("");
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    /** The value to display read-only. */
    readonly value = input<string>("");
}
