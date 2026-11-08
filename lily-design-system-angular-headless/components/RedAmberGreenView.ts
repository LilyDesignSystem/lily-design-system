import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * RedAmberGreenView — a read-only display of a red/amber/green status
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `red-amber-green-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-red-amber-green-view",
    standalone: true,
    template: `<span class="red-amber-green-view {{ className() }}" [attr.data-value]="value() || null">@if (label()) {<span class="screen-reader-span">{{ label() + " " }}</span>}{{ value() }}</span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RedAmberGreenView {
    /** Hidden text naming the value, for when no visible caption does. */
    readonly label = input<string>("");
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    /** The value to display read-only. */
    readonly value = input<string>("");
}
