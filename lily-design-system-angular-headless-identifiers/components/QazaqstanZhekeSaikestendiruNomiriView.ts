import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * QazaqstanZhekeSaikestendiruNomiriView — a read-only display of Kazakhstan's Individual Identification Number (IIN)
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `qazaqstan-zheke-saikestendiru-nomiri-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-qazaqstan-zheke-saikestendiru-nomiri-view",
    standalone: true,
    template: `<span class="qazaqstan-zheke-saikestendiru-nomiri-view {{ className() }}">@if (label()) {<span class="screen-reader-span">{{ label() + " " }}</span>}{{ value() }}</span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QazaqstanZhekeSaikestendiruNomiriView {
    /** Hidden text naming the value, for when no visible caption does. */
    readonly label = input<string>("");
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    /** The value to display read-only. */
    readonly value = input<string>("");
}
