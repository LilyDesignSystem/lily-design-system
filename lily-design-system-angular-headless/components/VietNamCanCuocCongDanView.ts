import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * VietNamCanCuocCongDanView — a read-only display of Viet Nam's Citizen Identification Number (CCCD)
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `viet-nam-can-cuoc-cong-dan-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-viet-nam-can-cuoc-cong-dan-view",
    standalone: true,
    template: `<span class="viet-nam-can-cuoc-cong-dan-view {{ className() }}">@if (label()) {<span class="screen-reader-span">{{ label() + " " }}</span>}{{ value() }}</span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VietNamCanCuocCongDanView {
    /** Hidden text naming the value, for when no visible caption does. */
    readonly label = input<string>("");
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    /** The value to display read-only. */
    readonly value = input<string>("");
}
