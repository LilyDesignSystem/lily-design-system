import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * SlovenijaEmsoView — a read-only display of Slovenia's Enotna Matična Številka Občana (EMŠO)
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `slovenija-emso-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-slovenija-emso-view",
    standalone: true,
    template: `<span class="slovenija-emso-view {{ className() }}">@if (label()) {<span class="screen-reader-span">{{ label() + " " }}</span>}{{ value() }}</span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlovenijaEmsoView {
    /** Hidden text naming the value, for when no visible caption does. */
    readonly label = input<string>("");
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    /** The value to display read-only. */
    readonly value = input<string>("");
}
