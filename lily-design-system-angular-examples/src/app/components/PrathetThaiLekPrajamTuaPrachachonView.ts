import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * PrathetThaiLekPrajamTuaPrachachonView — a read-only display of Thailand's เลขประจำตัวประชาชน (National Identification Number)
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `prathet-thai-lek-prajam-tua-prachachon-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-prathet-thai-lek-prajam-tua-prachachon-view",
    standalone: true,
    template: `<span class="prathet-thai-lek-prajam-tua-prachachon-view {{ className() }}">@if (label()) {<span class="screen-reader-span">{{ label() + " " }}</span>}{{ value() }}</span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrathetThaiLekPrajamTuaPrachachonView {
    /** Hidden text naming the value, for when no visible caption does. */
    readonly label = input<string>("");
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    /** The value to display read-only. */
    readonly value = input<string>("");
}
