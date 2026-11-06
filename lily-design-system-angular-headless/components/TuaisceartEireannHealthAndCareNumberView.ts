import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * TuaisceartEireannHealthAndCareNumberView — a read-only display of Tuaisceart Eireann Health and Care (H&C) Number unique national healthcare identifier
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `tuaisceart-eireann-health-and-care-number-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-tuaisceart-eireann-health-and-care-number-view",
    standalone: true,
    template: `<span class="tuaisceart-eireann-health-and-care-number-view {{ className() }}">@if (label()) {<span class="screen-reader-span">{{ label() + " " }}</span>}{{ value() }}</span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TuaisceartEireannHealthAndCareNumberView {
    /** Hidden text naming the value, for when no visible caption does. */
    readonly label = input<string>("");
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    /** The value to display read-only. */
    readonly value = input<string>("");
}
