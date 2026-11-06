import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * PolskaPeselView — a read-only display of Poland's PESEL
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `polska-pesel-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-polska-pesel-view",
    standalone: true,
    template: `<span class="polska-pesel-view {{ className() }}">@if (label()) {<span class="screen-reader-span">{{ label() + " " }}</span>}{{ value() }}</span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PolskaPeselView {
    /** Hidden text naming the value, for when no visible caption does. */
    readonly label = input<string>("");
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    /** The value to display read-only. */
    readonly value = input<string>("");
}
