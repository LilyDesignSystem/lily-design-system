import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiView — a read-only display of Uzbekistan's Personal identification number (JShShIR / PINFL)
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-view",
    standalone: true,
    template: `<span class="ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-view {{ className() }}">@if (label()) {<span class="screen-reader-span">{{ label() + " " }}</span>}{{ value() }}</span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiView {
    /** Hidden text naming the value, for when no visible caption does. */
    readonly label = input<string>("");
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    /** The value to display read-only. */
    readonly value = input<string>("");
}
