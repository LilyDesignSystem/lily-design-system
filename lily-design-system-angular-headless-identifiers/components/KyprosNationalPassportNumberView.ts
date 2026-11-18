import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * KyprosNationalPassportNumberView — a read-only display of Kypros's National Passport Number
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `kypros-national-passport-number-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-kypros-national-passport-number-view",
    standalone: true,
    template: `<span class="kypros-national-passport-number-view {{ className() }}">@if (label()) {<span class="screen-reader-span">{{ label() + " " }}</span>}{{ value() }}</span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KyprosNationalPassportNumberView {
    /** Hidden text naming the value, for when no visible caption does. */
    readonly label = input<string>("");
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    /** The value to display read-only. */
    readonly value = input<string>("");
}
