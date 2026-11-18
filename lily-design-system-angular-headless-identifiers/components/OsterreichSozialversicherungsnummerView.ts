import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * OsterreichSozialversicherungsnummerView — a read-only display of Austria's Sozialversicherungsnummer (SVNR)
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `osterreich-sozialversicherungsnummer-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-osterreich-sozialversicherungsnummer-view",
    standalone: true,
    template: `<span class="osterreich-sozialversicherungsnummer-view {{ className() }}">@if (label()) {<span class="screen-reader-span">{{ label() + " " }}</span>}{{ value() }}</span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OsterreichSozialversicherungsnummerView {
    /** Hidden text naming the value, for when no visible caption does. */
    readonly label = input<string>("");
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    /** The value to display read-only. */
    readonly value = input<string>("");
}
