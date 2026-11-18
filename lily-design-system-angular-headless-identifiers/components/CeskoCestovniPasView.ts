import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * CeskoCestovniPasView — a read-only display of Czech Republic's Cestovní pas
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `cesko-cestovni-pas-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-cesko-cestovni-pas-view",
    standalone: true,
    template: `<span class="cesko-cestovni-pas-view {{ className() }}">@if (label()) {<span class="screen-reader-span">{{ label() + " " }}</span>}{{ value() }}</span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CeskoCestovniPasView {
    /** Hidden text naming the value, for when no visible caption does. */
    readonly label = input<string>("");
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    /** The value to display read-only. */
    readonly value = input<string>("");
}
